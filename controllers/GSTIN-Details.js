import { fetchGSTINDetails } from "../models/GSTIN-details.js";

export const getGSTINDetails = async (req, res, next) => {
  const { scode } = req.query;
  if (scode) {
    try {
      const data = await fetchGSTINDetails(scode);
      if (data) {
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
      message: "Please provide a valid GST scode",
      data: null,
      error: null,
    });
  }
};
