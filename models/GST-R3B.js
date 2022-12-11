import prisma from "./index.js";

export const fetchR3B = async (GSTIN) => {
  const data = await prisma.R3B_FILERS.findFirst({
    where: {
      gstin: GSTIN,
    },
    select: {
      Id: true,
      gstin: true,
      ret_period: true,
      fil_dt: true,
      qn: true,
      sup_details: true,
      sup_inter: true,
      itc_elg: true,
      inward_sup: true,
      intr_ltfee: true,
      tax_pmt: true,
      EntryDate: true,
      FileURL: true,
      IsFiltered: true,
      FileId: true,
      CompiledTurnOver: true,
      MainJSON: true,
    },
  });

  return data;
};
