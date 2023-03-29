import { fetchR9 } from "../models/GST-R9.js";
import log from "../utils/log.js";

export const getR9Filers = async (req, res, next) => {
  // log("FETCH R9");
  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const data = await fetchR9(GSTIN);
      if (data && data.gstin.toLowerCase() == GSTIN.toLowerCase()) {
        // log("R9 SENT");
        res.status(200).send({
          message: "Fetch successful",
          data: data,
          error: null,
        });
      } else {
        res.status(200).send({
          message: "No content present for the provided GSTIN",
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
      message: "Please provide a valid GSTIN",
      data: null,
      error: null,
    });
  }
};
