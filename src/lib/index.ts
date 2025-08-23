import { LabelFormat } from './constants/enums/LabelFormats';
import { SweeperConfigs } from './models/SweeperConfigs';
import { Target } from './models/Target';
import { KMLGenerator } from './services/KMLGenerator';
import { PatternGenerator } from './services/PatternGenerator';
import { ProjectManager } from './services/ProjectManager';


// 🌍 Earth radius in meters
export const EARTH_RADIUS = 6378137.0;


// Lib-Module
export {
    KMLGenerator, LabelFormat, PatternGenerator, ProjectManager, SweeperConfigs, Target
};

