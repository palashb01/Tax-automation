import { fetchExistance } from "../models/GSTIN_EXISTS.js";
import log from "../utils/log.js";

export const getGstinExists = async (req, res, next) => {
  const { GSTIN } = req.query;

  if (GSTIN) {
    try {
      const data = await fetchExistance(GSTIN);

      if (!data) {
        res.status(404).send({
          message: "No record found",
          data: null,
          error: null,
        });
        return;
      }

      res.status(200).send({
        message: "Fetch successful",
        data: {
          gstin: data?.GSTIN ?? GSTIN,
          stats: {
            R3B_FILERS: data?.R3B_FILERS ?? false,
            R1_FILERS: data?.R1_FILERS ?? false,
            R9C_FILERS: data?.R9C_FILERS ?? false,
            R9_FILERS: data?.R9_FILERS ?? false,
            GSTR2A_FILERS: data?.GSTR2A_FILERS ?? false,
          },
        },
        error: null,
      });
    } catch (e) {
      log(e);
      res.status(500).send({
        message: "An error occured",
        data: null,
        error: e.message,
      });
    }
  } else {
    res.status(400).send({
      message: "Please provide a valid GSTIN",
      data: null,
      error: null,
    });
  }
};
