import BaseError, { SerializedErrorDetail } from "./base";
import {ValidationError as ExpressValidationError, Result} from 'express-validator';

class ValidationError extends BaseError {
    
    constructor(message: string, public details: Result<ExpressValidationError>) {
        super(message, 400);
    }

    get errorDetails(): SerializedErrorDetail[] {
        return this.details.array().map<SerializedErrorDetail>((item) => {
            return {
                context: item.param,
                message: item.msg,
            };
        })
    }

}

export default ValidationError;