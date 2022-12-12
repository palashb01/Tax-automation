import prisma from "./index.js";

export const fetchR1 = async (GSTIN) => {
  const data = await prisma.R1_Filers.findFirst({
    where: {
      GSTIN: GSTIN,
    },
    select: {
      Id: true,
      GSTIN: true,
      Returnperiod: true,
      GrossTurnover: true,
      cur_gt: true,
      filing_typ: true,
      fil_dt: true,
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
      doc_Issue: true,
      EntryDate: true,
      EntryMonth: true,
      URLDate: true,
      FileId: true,
      MainJSON: true,
      Filtered: true,
    },
  });

  return data;
};
