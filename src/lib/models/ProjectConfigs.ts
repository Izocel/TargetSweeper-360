import { z } from 'zod';
import { LabelFormat } from '../constants/enums/LabelFormats';
import { SweeperConfigs } from './SweeperConfigs';
import { Target } from './Target';

export class ProjectConfigs {
    Name: string;
    Target: Target;
    LabelFormat: LabelFormat;
    SweeperConfigs: SweeperConfigs;

    static readonly Schema = z.object({
        Name: z.string(),
        Target: Target.Schema,
        LabelFormat: z.enum(LabelFormat),
        SweeperConfigs: SweeperConfigs.Schema,
    });

    constructor(
        name: string,
        target: Target,
        labelFormat: LabelFormat,
        sweeperConfigs: SweeperConfigs
    ) {
        this.Name = name;
        this.Target = target;
        this.LabelFormat = labelFormat;
        this.SweeperConfigs = sweeperConfigs;
    }
}