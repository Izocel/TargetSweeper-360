import { mkdirSync, writeFileSync } from "fs";
import { SectorSearchPattern } from "../lib/models/SectorSearchPattern";
import { Target } from "../lib/models/Target";
import { handleFlooredOverflow, handleOverflow } from "../lib/utils/Math";

const SearchBuoy = new Target();
SearchBuoy.name = "Rescue Buoy";
SearchBuoy.speed = 2; // Rescue Buoy speed (drift speed knots)
SearchBuoy.heading = handleFlooredOverflow(0, 0, 360); // Rescue Buoy direction
SearchBuoy.latitude = handleOverflow(25.309029191286708, -90, 90); // Rescue Buoy latitude
SearchBuoy.longitude = handleOverflow(-90.06723415861805, -180, 180); // Rescue Buoy longitude

const SearchSpeed = 10; // Rescue vessel speed (knots)
const SearchRadius = 1_500; // Rescue vessel search radius (meters)

const data = {
    datum: SearchBuoy,
    speed: SearchSpeed,
    radius: SearchRadius,
    sectors: [] as Target[][],
}

const pattern = new SectorSearchPattern(data);

mkdirSync('projects/SectorSearchPatterns', { recursive: true });
writeFileSync('projects/SectorSearchPatterns/example-1.kml', pattern.generateKml());
