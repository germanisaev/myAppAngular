import { Inspection } from '@app/shared/_models';
import { Action, createAction, props } from '@ngrx/store';

export const REFRESH_INSPECTIONS_REQUEST = 'Refresh Inspections Request';
export const REFRESH_INSPECTIONS_DONE = 'Refresh Inspections Done';
export const APPEND_INSPECTION_REQUEST = 'Append Inspection Request';
export const REPLACE_INSPECTION_REQUEST = 'Replace Inspection Request';
export const DELETE_INSPECTION_REQUEST = 'Delete Inspection Request';
export const EDIT_INSPECTION = 'Edit Inspection';
export const CANCEL_INSPECTION = 'Cancel Inspection';

/* export class refreshInspectionsRequest implements Action { readonly type = REFRESH_INSPECTIONS_REQUEST; };
export class refreshInspectionsDone implements Action { readonly type = REFRESH_INSPECTIONS_DONE; constructor(public inspections: Inspection[]) { } };
export class appendInspectionRequest implements Action { readonly type = APPEND_INSPECTION_REQUEST; constructor(public inspection: Inspection) { } };
export class replaceInspectionRequest implements Action { readonly type = REPLACE_INSPECTION_REQUEST; constructor(public inspection: Inspection) { } };
export class deleteInspectionRequest implements Action { readonly type = DELETE_INSPECTION_REQUEST; constructor(public inspectionId: number) { } };
export class editInspection implements Action { readonly type = EDIT_INSPECTION; constructor(public inspectionId: number) { } };
export class cancelInspection implements Action { readonly type = CANCEL_INSPECTION };

export type InspectionActions = refreshInspectionsRequest | refreshInspectionsDone | appendInspectionRequest | replaceInspectionRequest | deleteInspectionRequest | editInspection | cancelInspection; */

export const refreshInspectionsRequest = createAction('[Inspection] Refresh Inspections Request');
export const refreshInspectionsDone = createAction('[Inspection] Refresh Inspections Done', props<{ inspections: Inspection[] }>());
export const appendInspectionRequest = createAction('[Inspection] Append Inspection Request', props<{ inspection: Inspection }>());
export const replaceInspectionRequest = createAction('[Inspection] Replace Inspection Request', props<{ inspection: Inspection }>());
export const deleteInspectionRequest = createAction('[Inspection] Delete Inspection Request', props<{ inspectionId: number }>());
export const editInspection = createAction('[Inspection] Edit Inspection', props<{ inspectionId: number }>());
export const cancelInspection = createAction('[Inspection] Cancel Inspection');