import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

const validStatuses = ['pending', 'paid', 'cancelled'];

@ValidatorConstraint({ name: 'isValidInvoiceStatus', async: false })
export class IsValidInvoiceStatusConstraint implements ValidatorConstraintInterface {
    validate(status: string, args: ValidationArguments) {
        const [allowedStatuses] = args.constraints;
        const valid = allowedStatuses ? allowedStatuses.includes(status) : validStatuses.includes(status);
        return valid;
    }

    defaultMessage(args: ValidationArguments) {
        return `Status must be one of the following: ${validStatuses.join(', ')}`;
    }
}

export function IsValidInvoiceStatus(allowedStatuses?: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [allowedStatuses],
            validator: IsValidInvoiceStatusConstraint,
        });
    };
}