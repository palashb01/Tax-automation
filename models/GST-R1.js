import prisma from "./index.js";

export const fetchR1 = async (GSTIN) => {
  const data = await prisma.R1_Filers.findMany({
    where: {
      Id:Id
    },
    select: {
      Id: true,
      GSTIN: true,
      filing_typ: true,
      b2b: true,
      b2ba: true,
      b2cl: true,
      b2cla: true,
      b2cs: true,
      b2csa: true,
      nil: true,
      Exports: true,
      AdvanceTax: true,
      AdvanceTaxAmendment: true,
      AdvanceAdjustedDetail: true,
      hsn: true,
      CreditandDebitNote: true,
      CreditandDebitNoteAmendment: true,
      CreditAndDebitNoteForUnregistered: true,
      CreditAndDebitNoteAmendmentForUnregistered: true,
    },
  });

  return data;
};
