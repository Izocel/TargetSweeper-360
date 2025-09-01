import { Target } from "./Target";
export interface SectorSearchConfig {
    datum: Target;
    radius: number;
    startAngle: number;
    sweepAngle: number;
    sweeps: number;
    step?: number;
}
