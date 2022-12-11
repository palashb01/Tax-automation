import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const users = await prisma.GSTIN_DETAILS.findMany();
console.log(users);
