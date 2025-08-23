"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRequest = void 0;
class BaseRequest {
    constructor(data, schema) {
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
    validate(data) {
        const results = this.schema?.safeParse(data);
        return {
            data: results?.data,
            isValid: results?.success,
            errors: results?.error?.issues
        };
    }
}
exports.BaseRequest = BaseRequest;
//# sourceMappingURL=BaseRequest.js.map