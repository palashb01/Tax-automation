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

export const updateMISViewdStatus = async (gstin_details, scode, viewed) => {
  if (gstin_details.viewed === viewed) {
    return gstin_details;
  }

  const data = await prisma.oFFICE_MASTER.update({
    where: {
      Scode: scode,
    },
    data: {
      viewed: {
        increment: 1,
      },
    },
  });

  return data;
};

export const updateMISActionStatus = async (gstin_details, scode, uobj) => {
  if (gstin_details.actionRequired === uobj.action) {
    return gstin_details;
  }

  if (gstin_details.actionRequired === false) {
    const data = await prisma.oFFICE_MASTER.update({
      where: {
        Scode: scode,
      },
      data: {
        actionRequired: {
          increment: 1,
        },
      },
    });

    return data;
  } else {
    const data = await prisma.oFFICE_MASTER.update({
      where: {
        Scode: scode,
      },
      data: {
        actionRequired: {
          decrement: 1,
        },
      },
    });

    return data;
  }
};

export const resetMIS = async (scode, fields) => {
  const data = await prisma.OFFICE_MASTER_ACTIONS.update({
    where: {
      Scode: scode,
    },
    data: {
      ...fields,
    },
  });

  return data;
}