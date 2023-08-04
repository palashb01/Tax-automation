import prisma from "./index.js";

export const fetchExistance = async (GSTIN) => {
  const data = await prisma.GSTIN_EXISTS.findFirst({
    where: {
      GSTIN: GSTIN,
    },
  });

  return data;
};
3;
