import { fetchGSTINList } from "../models/GSTIN.js";
import EMP_DETAIL from "../constants/emp_detail.js";
import log from "../utils/log.js";

export const getGSTINList = async (req, res) => {
  // log("FETCHING SCODE");
  let { scode } = req.query;
  // Prisma findMany returns data in random order if not in UpperCase
  scode = scode.toUpperCase()

  const emp = EMP_DETAIL[scode]

  if (scode) {
    try {
      const gstins = await fetchGSTINList(scode);
      if (gstins && gstins.length) {
        // log("SENT SCODE");
        res.status(200).send({
          message: "Fetch successful",
          data: { emp, gstins },
          error: null,
        });
      } else {
        res.status(200).send({
          message: "No content present for the provided scode",
          data: null,
          error: null,
        });
      }
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
      message: "Please provide a valid GST scode",
      data: null,
      error: null,
    });
  }
};
