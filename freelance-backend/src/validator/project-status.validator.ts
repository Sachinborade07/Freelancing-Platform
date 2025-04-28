import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

const validStatuses = ['draft', 'posted', 'in_progress', 'completed', 'cancelled'];

@ValidatorConstraint({ name: 'isValidProjectStatus', async: false })
export class IsValidProjectStatusConstraint implements ValidatorConstraintInterface {
    validate(status: string, args: ValidationArguments) {
        const [allowedStatuses] = args.constraints;
        const valid = allowedStatuses ? allowedStatuses.includes(status) : validStatuses.includes(status);
        return valid;
    }

    defaultMessage(args: ValidationArguments) {
        return `Status must be one of the following: ${validStatuses.join(', ')}`;
    }
}

export function IsValidProjectStatus(allowedStatuses?: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [allowedStatuses],
            validator: IsValidProjectStatusConstraint,
        });
    };
}