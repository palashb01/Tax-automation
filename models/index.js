import { PrismaClient } from "@prisma/client";

let prisma; 
try {
  prisma = new PrismaClient();
} catch (e) {
  console.log(e)
  if (e.code === "P1012") {
    console.log("Prisma Client could not be instantiated");
  }
}
    
export default prisma;
