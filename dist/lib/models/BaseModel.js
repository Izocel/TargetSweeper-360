"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModel = void 0;
class BaseModel {
    constructor(schema, data) {
        this._isValid = false;
        this.schema = schema;
        this._data = data;
        this.validate();
    }
    get data() {
        return this._data;
    }
    set data(data) {
        this._data = data;
        this.validate();
    }
    get isValid() {
        return this._isValid;
    }
    set isValid(isValid) {
        this._isValid = isValid;
    }
    get errors() {
        return this._errors;
    }
    set errors(errors) {
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
    enforce() {
        this.validate();
        if (!this.isValid) {
            throw new Error("Invalid Model Data: " + JSON.stringify(this.errors));
        }
    }
}
exports.BaseModel = BaseModel;
//# sourceMappingURL=BaseModel.js.map