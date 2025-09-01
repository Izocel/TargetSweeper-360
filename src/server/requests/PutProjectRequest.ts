import z from "zod";
import { LabelFormat } from "../../lib/constants/enums/LabelFormats";
import { SweeperConfigs } from "../../lib/models/SweeperConfigs";
import { Target } from "../../lib/models/Target";
import { BaseRequest } from "./BaseRequest";

export const ProjectConfigsSchema = z.object({
    name: z.string(),
    target: Target.Schema,
    sweeperConfigs: SweeperConfigs.Schema,
    labelFormat: z.enum(LabelFormat).optional().default(LabelFormat.SIMPLE),
});

export class PutProjectRequest extends BaseRequest {
    readonly schema = ProjectConfigsSchema;
    readonly data?: z.infer<typeof ProjectConfigsSchema> = undefined;

    constructor(data: z.infer<typeof ProjectConfigsSchema>) {
        super(data, ProjectConfigsSchema);
    }
}