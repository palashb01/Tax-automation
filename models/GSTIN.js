import prisma from "./index.js";

export const fetchGSTINList = async (scode) => {
  const data = await prisma.GSTIN_DETAILS.findMany({
    where: {
      div_scode: scode,
    },
    select: {
      id: true,
      GSTIN: true,
      div_scode: true,
    },
  });

  return data;
};

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

