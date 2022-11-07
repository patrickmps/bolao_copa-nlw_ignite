import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ['query'], // para o prisma emitir logs de todas as querys
})