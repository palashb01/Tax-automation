import prisma from "./index.js";

export const fetchGSTINList = async (scode) => {
  const data =
        await prisma.$queryRaw`SELECT id, GSTIN, GSTINDetails, div_scode FROM DATA_1718_IIT_20172018.dbo.GSTIN_DETAILS WHERE div_scode=${scode} ORDER BY TurnOver_1718 DESC`;
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
  const data = await prisma.$queryRaw`SELECT TOP 1 id, GSTIN, GSTINDetails, div_scode FROM DATA_1718_IIT_20172018.dbo.GSTIN_DETAILS WHERE GSTIN=${GSTIN}`;

  return data[0];
};
