import prisma from "./index.js";

export const updateASMT = async (scode, boweb, drc, further_action) => {
  const data = await prisma.oFFICE_MASTER_ACTIONS.update({
    where: {
      Scode: scode,
    },
    data: {
      ASMT_10_Boweb: boweb ?? 0,
      ASMT_10_73_74: drc ?? 0,
      ASMT_10_DRC_03: further_action ?? 0,
    },
  });

  return data;
};
