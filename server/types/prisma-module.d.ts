// Explicit module declaration for imports that reference the JS file path
// e.g. `import prisma from '../lib/prisma.js'`
declare module '../lib/prisma.js' {
  import { PrismaClient } from '@prisma/client';
  const prisma: PrismaClient;
  export default prisma;
}
