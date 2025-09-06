import { mkdirSync, writeFileSync } from "fs";
import { ParallelTrackPattern } from "../lib/models/ParallelTrackPattern";
import { Target } from "../lib/models/Target";
import { handleFlooredOverflow, handleOverflow } from "../lib/utils/Math";

const ParallelTrackVector = new Target();
ParallelTrackVector.stepDistance = 80; // meters
ParallelTrackVector.heading = handleFlooredOverflow(63, 0, 360);
ParallelTrackVector.latitude = handleOverflow(43.30750, -90, 90);
ParallelTrackVector.longitude = handleOverflow(-79.62972, -180, 180);

const ParallelTrackSpeed = 10; // knots/s
const ParallelTrackSpacing = 20; // meters
const ParallelTrackTargets = [] as Target[];

const data = {
    speed: ParallelTrackSpeed,
    vector: ParallelTrackVector,
    targets: ParallelTrackTargets,
    spacing: ParallelTrackSpacing,
};

const pattern = new ParallelTrackPattern(data);

mkdirSync('projects/ParallelTrackPatterns', { recursive: true });
writeFileSync('projects/ParallelTrackPatterns/example-1.kml', pattern.generateKml());
