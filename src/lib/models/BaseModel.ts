import z from "zod";

export abstract class BaseModel<T extends z.ZodSchema> {
    readonly schema: T;
    protected _data: z.infer<T>;
    protected _isValid: boolean = false;
    protected _errors?: z.core.$ZodIssue[];

    constructor(schema: T, data: z.infer<T>) {
        this.schema = schema;
        this._data = data;
        this.validate();
    }

    get data(): z.infer<T> {
        return this._data;
    }

    set data(data: z.infer<T>) {
        this._data = data;
        this.validate();
    }

    get isValid(): boolean {
        return this._isValid;
    }

    set isValid(isValid: boolean) {
        this._isValid = isValid;
    }

    get errors(): z.core.$ZodIssue[] | undefined {
        return this._errors;
    }

    set errors(errors: z.core.$ZodIssue[] | undefined) {
        this._errors = errors;
    }

    toObject() {
        return {
            data: this._data,
            errors: this._errors,
            isValid: this._isValid,
        };
    }

    validate() {
        const results = this.schema.safeParse(this.data);
        this._errors = results.error?.issues;
        this._data = results.data ?? this.data;
        this._isValid = results.success ?? false;

        return {
            data: this._data,
            errors: this._errors,
            isValid: this._isValid,
        };
    }

    enforce(): void {
        this.validate();

        if (!this.isValid) {
            throw new Error("Invalid Model Data: " + JSON.stringify(this.errors));
        }
    }
}
