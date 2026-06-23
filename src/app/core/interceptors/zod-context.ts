import { HttpContextToken } from '@angular/common/http';
import { ZodType } from 'zod';

export const Z_SCHEMA = new HttpContextToken<ZodType<unknown, any, any> | null>(() => null);
