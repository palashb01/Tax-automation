import prisma from "./index.js";

export const fetchR9 = async (GSTIN) => {
  const data = await prisma.R9_FILERS.findFirst({
    where: {
      gstin: GSTIN,
    },
    select: {
      gstin: true,
      fp: true,
      fil_dt: true,
      isnil: true,
      table4: true,
      table5: true,
      table6: true,
      table7: true,
      table8: true,
      table9: true,
      table10: true,
      table14: true,
      table15: true,
      table16: true,
      table17: true,
      table18: true,
      tax_pay: true,
      tax_paid: true,
      EntryDate: true,
      FileURL: true,
      IsFiltered: true,
      FileId: true,
    },
  });

  return data;
};
