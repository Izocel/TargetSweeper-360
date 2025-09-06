import { mkdirSync, writeFileSync } from "fs";
import { ExpandingSquarePattern } from "../lib/models/ExpandingSquarePattern";
import { Target } from "../lib/models/Target";
import { handleFlooredOverflow, handleOverflow } from "../lib/utils/Math";

const ExpandingSquareDatum = new Target();
ExpandingSquareDatum.name = "Search Buoy";
ExpandingSquareDatum.heading = handleFlooredOverflow(0, 0, 360);
ExpandingSquareDatum.longitude = handleOverflow(-78.81167, -180, 180);
ExpandingSquareDatum.latitude = handleOverflow(43.58222, -90, 90);


const ExpandingSquareSpeed = 10; // knots
const ExpandingSquareHeight = 40_000; // Total search area height in meters
const ExpandingSquareWidth = 60_000;  // Total search area width in meters
const VesselVisualDistance = 1_500;   // Effective visual search distance in meters

const data = {
    datum: ExpandingSquareDatum,
    speed: ExpandingSquareSpeed,
    height: ExpandingSquareHeight,
    width: ExpandingSquareWidth,
    vesselVisualDistance: VesselVisualDistance,
    targets: [],
};

const pattern = new ExpandingSquarePattern(data);

mkdirSync('projects/ExpandingSquarePatterns', { recursive: true });
writeFileSync('projects/ExpandingSquarePatterns/example-1.kml', pattern.generateKml());
