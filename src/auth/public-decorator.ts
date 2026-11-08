import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
// @Public() menandai endpoint yang boleh diakses tanpa token
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);