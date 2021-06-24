import { Injectable } from '@angular/core';
import { GroomingService } from '@app/shared/_services';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import {
  appendInspectionRequest,  
  deleteInspectionRequest,  
  refreshInspectionsDone, 
  refreshInspectionsRequest, 
  replaceInspectionRequest
} from './grooming.actions';


@Injectable()
export class GroomingEffects {

  constructor(
    private groomingService: GroomingService,
    private actions$: Actions,
  ) {}

  refreshInspections$ = createEffect(() => this.actions$.pipe(
    ofType(refreshInspectionsRequest),
    switchMap(() => {
      return this.groomingService.getAll().pipe(
        map(inspections => refreshInspectionsDone({ inspections })),
      );
    }),
  ));

  appendInspection$ = createEffect(() => this.actions$.pipe(
    ofType(appendInspectionRequest),
    switchMap((action) => {
      return this.groomingService.createItem(action.inspection).pipe(
        map(() => refreshInspectionsRequest()),
      );
    }),
  ));

  replaceInspection$ = createEffect(() => this.actions$.pipe(
    ofType(replaceInspectionRequest),
    switchMap((action) => {
      return this.groomingService.updateItem(action.inspection).pipe(
        map(() => refreshInspectionsRequest()),
      );
    }),
  ));

  deleteInspection$ = createEffect(() => this.actions$.pipe(
    ofType(deleteInspectionRequest),
    switchMap((action) => {
      return this.groomingService.deleteItem(action.inspectionId).pipe(
        map(() => refreshInspectionsRequest()),
      );
    }),
  ));
}