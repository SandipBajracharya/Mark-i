import { Prisma } from '@prisma/client';

export type UserAttrubute = keyof Prisma.UserSelect;
