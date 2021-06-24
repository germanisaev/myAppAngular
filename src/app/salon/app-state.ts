import { Inspection } from "@app/shared/_models";

export interface AppState {
    inspections: Inspection[];
    editInspectionId: number;
}