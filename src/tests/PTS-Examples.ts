import { mkdirSync, writeFileSync } from "fs";
import { ParallelTrackPattern } from "../lib/models/ParallelTrackPattern";
import { Target } from "../lib/models/Target";
import { handleFlooredOverflow, handleOverflow } from "../lib/utils/Math";

const ParallelTrackVector = new Target();
ParallelTrackVector.stepDistance = 42_000; // meters
ParallelTrackVector.heading = handleFlooredOverflow(0, 0, 360); //63
ParallelTrackVector.latitude = handleOverflow(43.30186, -90, 90);
ParallelTrackVector.longitude = handleOverflow(-79.78602, -180, 180);

const ParallelTrackSpeed = 10; // knots/s
const ParallelTrackSpacing = 1_500; // meters
const ParallelTrackHeight = 10_000; // meters
const ParallelTrackTargets = [] as Target[];

const data = {
    speed: ParallelTrackSpeed,
    height: ParallelTrackHeight,
    vector: ParallelTrackVector,
    targets: ParallelTrackTargets,
    spacing: ParallelTrackSpacing,
};

const pattern = new ParallelTrackPattern(data);

mkdirSync('projects/ParallelTrackPatterns', { recursive: true });
writeFileSync('projects/ParallelTrackPatterns/example-1.kml', pattern.generateKml());
