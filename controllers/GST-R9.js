import { fetchR9 } from "../models/GST-R9.js";

export const getR9Filers = async (req, res, next) => {
  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const data = await fetchR9(GSTIN);
      if (data && data.gstin.toLowerCase() == GSTIN.toLowerCase()) {
        res.status(200).send({
          message: "Fetch successful",
          data: data,
          error: null,
        });
      } else {
        res.status(204).send({
          message: "No content present for the provided GSTIN",
          data: data,
          error: null,
        });
      }
    } catch (e) {
      console.log(e.message);
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
