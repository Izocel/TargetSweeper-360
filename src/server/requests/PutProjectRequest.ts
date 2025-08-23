import z from "zod";
import { LabelFormat, SweeperConfigs, Target } from "../../lib";
import { BaseRequest } from "./BaseRequest";

export const ProjectConfigsSchema = z.object({
    name: z.string(),
    target: z.lazy(() => Target.Schema),
    sweeperConfigs: z.lazy(() => SweeperConfigs.Schema),
    labelFormat: z.enum(LabelFormat).optional().default(LabelFormat.SIMPLE),
});

export class PutProjectRequest extends BaseRequest {
    readonly schema = ProjectConfigsSchema;
    readonly data?: z.infer<typeof ProjectConfigsSchema>;

    constructor(data: z.infer<typeof ProjectConfigsSchema>) {
        super(data, ProjectConfigsSchema);
    }
}