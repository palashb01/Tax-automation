import { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClient2 } from "../prisma/generated/client2/index.js";

const prisma = new PrismaClient();
export const prisma2 = new PrismaClient2();
    
export default prisma;
