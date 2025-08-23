import { z } from 'zod';
import { LabelFormat } from '../constants/enums/LabelFormats';
import { SweeperConfigs } from './SweeperConfigs';
import { Target } from './Target';
export declare class ProjectConfigs {
    Name: string;
    Target: Target;
    LabelFormat: LabelFormat;
    SweeperConfigs: SweeperConfigs;
    static readonly Schema: z.ZodObject<{
        Name: z.ZodString;
        Target: z.ZodObject<{
            name: z.ZodString;
            longitude: z.ZodNumber;
            latitude: z.ZodNumber;
        }, z.core.$strip>;
        LabelFormat: z.ZodEnum<typeof LabelFormat>;
        SweeperConfigs: z.ZodObject<{
            radiusStep: z.ZodNumber;
            maxRadius: z.ZodNumber;
            angleStepMOA: z.ZodNumber;
            angleStepDegrees: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    constructor(name: string, target: Target, labelFormat: LabelFormat, sweeperConfigs: SweeperConfigs);
}
