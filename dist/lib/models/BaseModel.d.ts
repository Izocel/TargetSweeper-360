import z from "zod";
export declare abstract class BaseModel<T extends z.ZodSchema> {
    readonly schema: T;
    protected _data: z.infer<T>;
    protected _isValid: boolean;
    protected _errors?: z.core.$ZodIssue[];
    constructor(schema: T, data: z.infer<T>);
    get data(): z.infer<T>;
    set data(data: z.infer<T>);
    get isValid(): boolean;
    set isValid(isValid: boolean);
    get errors(): z.core.$ZodIssue[] | undefined;
    set errors(errors: z.core.$ZodIssue[] | undefined);
    toObject(): {
        data: z.core.output<T>;
        errors: z.core.$ZodIssue[] | undefined;
        isValid: boolean;
    };
    validate(): {
        data: z.core.output<T>;
        errors: z.core.$ZodIssue[] | undefined;
        isValid: boolean;
    };
    enforce(): void;
}
