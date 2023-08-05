import prisma from "./index.js";

export const fetchExistance = async (GSTIN) => {
  const data = await prisma.GSTIN_EXISTS.findUnique({
    where: {
      GSTIN: GSTIN,
    },
  });
  console.log(data)
  return data;
};
