import { LabelFormat } from './constants/enums/LabelFormats';
import { SweepConfiguration } from './models/SweepConfiguration';
import { Target } from './models/Target';
import { KMLGenerator } from './services/KMLGenerator';
import { ProjectManager } from './services/ProjectManager';
import { SweepPatternGenerator } from './services/SweepPatternGenerator';


// 🌍 Earth radius in meters
export const EARTH_RADIUS = 6378137.0;


// Lib-Module
export {
    KMLGenerator, LabelFormat, ProjectManager, SweepConfiguration,
    SweepPatternGenerator, Target
};

