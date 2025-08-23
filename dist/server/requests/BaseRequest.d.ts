import z from "zod";
export declare class BaseRequest {
    readonly schema?: z.ZodSchema<any>;
    readonly isValid?: boolean | undefined;
    readonly errors?: z.core.$ZodIssue[] | undefined;
    readonly data?: z.infer<typeof this.schema> | undefined;
    constructor(data: any, schema: z.ZodSchema<any>);
    enforce(): void;
    toObject(): {
        isValid: boolean | undefined;
        errors: z.core.$ZodIssue[] | undefined;
        data: any;
    };
    validate(data?: any): {
        data: any;
        isValid: boolean | undefined;
        errors: z.core.$ZodIssue[] | undefined;
    };
}
