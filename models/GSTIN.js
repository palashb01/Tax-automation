import prisma from "./index.js";

export const fetchGSTINList = async (scode) => {
  const data =
    await prisma.$queryRaw`SELECT id, GSTIN, GSTINDetails, div_scode, actionRequired, review FROM DATA_1718_IIT_ALL.dbo.GSTIN_DETAILS WHERE div_scode=${scode}`;
  // const data = await prisma.GSTIN_DETAILS.findMany({
  //   where: {
  //     div_scode: scode,
  //   },
  //   select: {
  //     id: true,
  //     GSTIN: true,
  //     div_scode: true,
  //     GSTINDetails: true,
  //     actionRequired: true,
  //     review: true,
  //   },
  // });

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

export const writeReview = async (id, review) => {
  const data = await prisma.GSTIN_DETAILS.update({
    where: {
      id: id,
    },
    data: {
      review: review,
    },
  });

  return data;
};

export const toggleActionRequired = async (id, action) => {
  const data = await prisma.GSTIN_DETAILS.update({
    where: {
      id: id,
    },
    data: {
      actionRequired: action,
    },
  });

  return data;
};
