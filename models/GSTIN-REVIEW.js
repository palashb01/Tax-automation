export const fetchGSTINDetails = async (GSTIN) => {
  const data = await prisma.$queryRaw`SELECT TOP 1 id, GSTIN, div_scode, actionRequired, review FROM DATA_1718_IIT_20172018.dbo.GSTIN_REVIEW WHERE GSTIN=${GSTIN}`;
  return data[0];
};

export const writeStatus = async (id, updatedData) => {
  let reqObj = (({ review, action, viewed }) => ({ review, actionRequired: action, viewed }))(
    updatedData
  );
  // filter out undefined properties
  reqObj = Object.fromEntries(
        Object.entries(reqObj).filter((entry) => entry[1] != undefined)
      );
    const data = await prisma.GSTIN_REVIEW.update({
      where: {
        id: id,
      },
      data: reqObj,
    });

    return data;
}

export const writeReview = async (id, review) => {
  const data = await prisma.GSTIN_REVIEW.update({
    where: {
      id: id,
    },
    data: {
      review: review,
    },
  });

  return data;
};

export const toggleActionRequired = async (id, action) => {
  const data = await prisma.GSTIN_REVIEW.update({
    where: {
      id: id,
    },
    data: {
      actionRequired: action,
    },
  });

  return data;
};

export const updateViewed = async (gstin, viewed) => {
  const data =
    await prisma.$queryRaw`UPDATE DATA_1718_IIT_20172018.dbo.GSTIN_REVIEW SET viewed=${viewed} WHERE GSTIN=${gstin}`;

  return data;
};
