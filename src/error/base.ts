export interface SerializedErrorDetail {
    context: string,
    message: string,
}

export interface SerializedError {
    status: number,
    message: string,
    details: SerializedErrorDetail[],
}

abstract class BaseError extends Error {
    
    constructor(public message: string, public status: number) {
        super(message);
    }

    abstract get errorDetails(): SerializedErrorDetail[];

    serialize(): SerializedError {
        return {
            status: this.status,
            message: this.message,
            details: this.errorDetails
        }
    }

}

export default BaseError;