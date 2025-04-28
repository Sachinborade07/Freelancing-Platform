import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

export const CustomThrottle = (limit: number, ttl: number) => {
    return applyDecorators(
        SetMetadata('skipThrottle', false),
        Throttle({ limit, ttl } as any),
    );
};