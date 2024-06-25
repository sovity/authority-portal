import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {Subject} from 'rxjs';
import {finalize, takeUntil} from 'rxjs/operators';
import {NgxJsonViewerComponent} from 'ngx-json-viewer';
import {cleanJson} from './clean-json';
import {DialogToolbarButton, JsonDialogData} from './json-dialog.data';

@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
})
export class JsonDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  busy = false;

  removeNulls = true;

  visibleJson: unknown = {};

  @ViewChild(NgxJsonViewerComponent, {read: ElementRef})
  jsonViewer!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<JsonDialogComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: JsonDialogData,
  ) {}

  ngOnInit() {
    this.updateVisibleJson();
  }

  ngAfterViewInit() {
    this.jsonViewer.nativeElement.scrollIntoView();
  }

  updateVisibleJson() {
    this.visibleJson = this.removeNulls
      ? cleanJson(this.data.objectForJson)
      : this.data.objectForJson;
  }
  doAction(button: DialogToolbarButton) {
    if (this.busy) {
      return;
    }
    this.busy = true;
    button
      .action()
      .pipe(
        finalize(() => (this.busy = false)),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe();
  }

  ngOnDestroy$ = new Subject();

  ngOnDestroy(): void {
    this.ngOnDestroy$.next(null);
    this.ngOnDestroy$.complete();
  }
}
