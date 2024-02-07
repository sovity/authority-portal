import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';
import {
  FilterBarConfig,
  FilterQuery,
} from 'src/app/shared/components/common/filter-bar/filter-bar.model';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
})
export class FilterBarComponent implements OnInit, OnDestroy {
  @Input() filterBarConfig!: FilterBarConfig;
  @Output() onFilter = new EventEmitter<FilterQuery>();

  menuVisible: {[key: string]: boolean} = {};
  filterForm: FormGroup;

  private ngOnDestroy$ = new Subject();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click occurred outside the filter menus and buttons
    if (!this.el.nativeElement.contains(event.target)) {
      // Close all filter menus
      Object.keys(this.menuVisible).forEach((key) => {
        this.menuVisible[key] = false;
      });
    }
  }

  constructor(private formBuilder: FormBuilder, private el: ElementRef) {
    this.filterForm = this.formBuilder.group({
      searchCtrl: [''],
    });
  }

  ngOnInit(): void {
    this.formMaker();
    this.listenToFilterChange();
  }

  formMaker() {
    this.filterBarConfig.filters.forEach((filter) => {
      this.menuVisible[filter.id] = false;
      this.filterForm.addControl(filter.id, this.formBuilder.control([]));
    });
  }

  /**
   * Listen to filter change after 500ms debounce
   */
  listenToFilterChange() {
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe((value) => {
        this.onFilter.emit(value);
      });
  }

  /**
   * Handle filter change
   * @param event
   * @param query
   * @param value
   */
  onFilterChange(event: any, query: string, value: string) {
    event.preventDefault(); // Prevent the default behavior
    event.stopPropagation(); // Prevent the event from propagating
    let selectedFilters = this.filterForm.get(query)?.value;
    if (event.checked) {
      selectedFilters.push(value);
    } else {
      selectedFilters = selectedFilters.filter(
        (filter: string) => filter !== value,
      );
    }
    this.filterForm.get(query)?.setValue(selectedFilters);
  }

  /**
   *  Open and close a singe menu at a time
   * @param filterId
   */
  openMenu(filterId: string) {
    Object.keys(this.menuVisible).forEach((key) => {
      if (key !== filterId) {
        this.menuVisible[key] = false;
      }
    });
    this.menuVisible[filterId] = !this.menuVisible[filterId];
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
