import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Subject, debounceTime, distinctUntilChanged, takeUntil} from 'rxjs';
import {
  Filter,
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

  filterForm: FormGroup;
  ngOnDestroy$ = new Subject();

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
      let formGroup = this.formBuilder.group({});
      filter.options.forEach((option) => {
        formGroup.addControl(option.id, this.formBuilder.control(false));
      });
      this.filterForm.addControl(filter.id, formGroup);
    });
  }

  getFilterForm(optionId: string) {
    return this.filterForm.get(optionId) as FormGroup;
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
        const {searchCtrl, ...filters} = value;
        const query = {
          searchCtrl,
          ...Object.fromEntries(
            this.filterBarConfig.filters.map((filter: Filter) => [
              filter.id,
              Object.keys(filters[filter.id]).filter(
                (key) => filters[filter.id][key],
              ),
            ]),
          ),
        };
        this.onFilter.emit(query);
      });
  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
