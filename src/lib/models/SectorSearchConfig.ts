import { Target } from "./Target";

export interface SectorSearchConfig {
    // The center point of the search 
    datum: Target

    // The radius of the sector (in meters)
    radius: number;
    // The starting angle of the sector (in degrees)
    startAngle: number;
    // The sweep angle of the sector (in degrees)
    sweepAngle: number;
    // The number of sweeps or passes
    sweeps: number;
    // Optional: step between sweeps (in meters)
    step?: number;
}
