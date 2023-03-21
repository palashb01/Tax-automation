import prisma from "./index.js";

export const fetchR9C = async (GSTIN) => {
  const data =
    await prisma.$queryRaw`SELECT TOP 1 * FROM DATA_1718_IIT_20172018.dbo.R9C_FILERS WHERE GSTIN=${GSTIN}`;
  // const data = await prisma.R9C_FILERS.findFirst({
  //   where: {
  //     gstr9cdata: {
  //       contains: `"gstin":"${GSTIN.toUpperCase()}"`,
  //     },
  //   },
  //   select: {
  //     fil_dt: true,
  //     dcupdtls: true,
  //     gstr9cdata: true,
  //     FileId: true,
  //     IsFiltered: true,
  //   },
  // });


  return data[0] || null;
};
