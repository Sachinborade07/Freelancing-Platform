import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

const validStatuses = ['pending', 'achieved'];

@ValidatorConstraint({ name: 'isValidMilestoneStatus', async: false })
export class IsValidMilestoneStatusConstraint implements ValidatorConstraintInterface {
    validate(status: string, args: ValidationArguments) {
        const [allowedStatuses] = args.constraints;
        const valid = allowedStatuses ? allowedStatuses.includes(status) : validStatuses.includes(status);
        return valid;
    }

    defaultMessage(args: ValidationArguments) {
        return `Status must be one of the following: ${validStatuses.join(', ')}`;
    }
}

export function IsValidMilestoneStatus(allowedStatuses?: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [allowedStatuses],
            validator: IsValidMilestoneStatusConstraint,
        });
    };
}