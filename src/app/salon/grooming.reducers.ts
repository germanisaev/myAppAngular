import { Inspection } from '@app/shared/_models';
import { createReducer, on } from '@ngrx/store';
import { refreshInspectionsDone, editInspection, cancelInspection } from './grooming.actions';
import { AppState } from './app-state';

/* export const inspectionsReducer = createReducer(
  AppState,
  
  on(InspectionActions.refreshInspectionsDone, (state, { inspections }) => {
    console.log("Employee Reducer Called")
    return {
       ...state, //Insert Add Logic here
    };
  }),

  on(EmployeeActions.editEmployee, (state, { payload }) => {
    console.log("Employee Reducer Called")
    return {
       ...state, //Insert Edit Logic here
    };
  }),
); */


export const inspectionsReducer = createReducer<Inspection[]>([],
  on(refreshInspectionsDone, (_, action) => action.inspections),
);

export const editInspectionIdReducer = createReducer<number>(-1,
  on(editInspection, (_, action) => action.inspectionId),
  on(cancelInspection, () => -1),
  on(refreshInspectionsDone, () => -1),
);