import { prisma2 as prisma } from "./index.js";

export const fetchR9C = async (GSTIN) => {
  const data = await prisma.R9C_FILERS.findFirst({
    where: {
      gstr9cdata: {
        contains: `"gstin":"${GSTIN}"`,
      },
    },
    select: {
      Id,
      fil_dt,
      dcupdtls,
      gstr9cdata,
      FileId,
      IsFiltered,
    },
  });

  return { ...data, gstin: GSTIN };
};
