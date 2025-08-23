import z from "zod";

export class BaseRequest {
    readonly schema?: z.ZodSchema<any>;
    readonly isValid?: boolean | undefined;
    readonly errors?: z.core.$ZodIssue[] | undefined;
    readonly data?: z.infer<typeof this.schema> | undefined;

    constructor(data: any, schema: z.ZodSchema<any>) {
        this.schema = schema;
        const results = this.validate(data);

        this.data = results.data;
        this.errors = results.errors;
        this.isValid = results.isValid;
    }

    enforce() {
        if (!this.isValid) {
            throw new Error("Invalid project request data: " + JSON.stringify(this.errors));
        }
    }

    toObject() {
        return {
            isValid: this.isValid,
            errors: this.errors,
            data: this.data
        };
    }

    validate(data?: any) {
        const results = this.schema?.safeParse(data);

        return {
            data: results?.data,
            isValid: results?.success,
            errors: results?.error?.issues
        };
    }
}