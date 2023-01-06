import prisma from "./index.js";

export const fetchGSTINDetails = async (GSTIN) => {
  const data = await prisma.GSTIN_DETAILS.findFirst({
    where: {
      GSTIN: GSTIN,
    },
    select: {
      GSTIN: true,
      GSTINDetails: true,
      id: true,
    },
  });

  return data;
};
