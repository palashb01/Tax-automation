import { fetchR3B } from "../models/GST-R3B.js";

export const getR3BFilers = async (req, res, next) => {
  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const data = await fetchR3B(GSTIN);
      console.log(data);
      if (data && data.gstin.toLowerCase() == GSTIN.toLowerCase()) {
        if (data.FileId) {
          data.FileId = data.FileId.toString();
        }
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
