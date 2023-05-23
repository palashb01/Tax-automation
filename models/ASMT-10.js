import prisma from "./index.js";

export const updateASMT = async (scode, boweb, drc, further_action) => {
  const previousData = await prisma.oFFICE_MASTER_ACTIONS.findUnique({
    where: {
      Scode: scode,
    },
  });
  
  const data = await prisma.oFFICE_MASTER_ACTIONS.update({
    where: {
      Scode: scode,
    },
    data: {
      ASMT_10_Boweb: (previousData.boweb ?? 0) + boweb ?? 0,
      ASMT_10_73_74: (previousData.drc ?? 0) + drc ?? 0,
      ASMT_10_DRC_03: (previousData.further_action ?? 0) + further_action ?? 0,
    },
  });

  return data;
};
