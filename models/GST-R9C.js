import { prisma2 as prisma } from "./index.js";

export const fetchR9C = async (GSTIN) => {
  const data = await prisma.R9C_FILERS.findFirst({
    select: {
      gstr9cdata: true,
    },
  });

  return { ...data, gstin: GSTIN };
};
