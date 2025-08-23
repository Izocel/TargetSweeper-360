import { TargetSweeperApi } from './api';
import { LabelFormat } from './lib/constants/enums/LabelFormats';
import { SweeperConfigs } from './lib/models/SweeperConfigs';
import { Target } from './lib/models/Target';
import { KMLGenerator } from './lib/services/KMLGenerator';
import { PatternGenerator } from './lib/services/PatternGenerator';
import { ProjectManager } from './lib/services/ProjectManager';

export const EARTH_RADIUS = 6378137;


// Export for use as a module
export {
    KMLGenerator, LabelFormat, PatternGenerator, ProjectManager, SweeperConfigs, Target, TargetSweeperApi
};

