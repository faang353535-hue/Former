import { PrismaClient } from '@prisma/client';

/**
 * Declaration for the default export from `lib/prisma.js`.
 * This lets TypeScript know the exported `prisma` instance is a PrismaClient.
 */
declare const prisma: PrismaClient;
export default prisma;
