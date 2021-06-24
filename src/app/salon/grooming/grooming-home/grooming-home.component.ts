import { Component, OnInit } from '@angular/core';
import { Inspection } from '@app/shared/_models';
import { GroomingService } from '@app/shared/_services';
import { Observable } from 'rxjs';

import { Store, select } from '@ngrx/store';

import { AppState } from '../../app-state';
import {
  refreshInspectionsRequest,
  appendInspectionRequest,
  replaceInspectionRequest,
  deleteInspectionRequest,
  editInspection,
  cancelInspection
} from '../../grooming.actions';

@Component({
  selector: 'grooming-home',
  templateUrl: './grooming-home.component.html',
})
export class GroomingHomeComponent implements OnInit {

  headerText = 'Grooming Tool';
  //inspections$: Observable<Array<Grooming>>;
  duplicate$: Observable<Array<Inspection>>;

  inspections$ = this.store.pipe(select(state => state.inspections));
  editInspectionId$ = this.store.pipe(select('editInspectionId'));
  
  constructor(private store: Store<AppState>) {}
  
  ngOnInit() {
    this.store.dispatch(refreshInspectionsRequest());
  }
  
  doAppendInspection(inspection: Inspection) {
    this.store.dispatch(appendInspectionRequest({ inspection }));
  }
  
  doReplaceInspection(inspection: Inspection) {
    this.store.dispatch(replaceInspectionRequest({ inspection }));
  }
  
  doDeleteInspection(inspectionId: number) {
    this.store.dispatch(deleteInspectionRequest({ inspectionId }));
  }
  
  doEditInspection(inspectionId: number) {
    this.store.dispatch(editInspection({ inspectionId }));
  }
  
  doCancelInspection() {
    this.store.dispatch(cancelInspection());
  }

  /* 
  constructor(
    private service: GroomingService,
  ) { }

  ngOnInit(): void {
    this.doLoad();
  }

  doLoad() {
    this.inspections$ = this.service.getAll();
    this.duplicate$ = this.inspections$;
  }

  doFilterDate(value) {
    this.duplicate$ = value;
  }

  doCancel(value) {
    this.doLoad();
  } */

}
