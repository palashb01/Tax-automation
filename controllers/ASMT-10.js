import { updateASMT } from "../models/ASMT-10.js";
import log from "../utils/log.js";

export const postMISData = async (req, res) => {
  const { scode, boweb: b, drc: d, further_action: f } = req.body;

  if (scode) {
    if(b === undefined || d === undefined || f === undefined) {
      return res.status(400).send({
        message: "Please send all the query",
        data: null,
        error: null,
      });
    }
    try {
      if (typeof b !== "number" && d !== "number" && f !== "number") {
        return res.status(400).send({
          message: "Please send valid integer fields",
          data: null,
          error: null,
        });
      }

      let boweb = 0,
        drc = 0,
        further_action = 0;
      try {
        boweb = parseInt(b);
        drc = parseInt(d);
        further_action = parseInt(f);
      } catch (e) {
        res.status(400).send({
          message: "Please provide valid Integers as query",
          data: null,
          error: e,
        });
      }
      if (boweb && drc && further_action) {
        const data = await updateASMT(scode, boweb, drc, further_action);
        res.status(200).send({
          message: "ASMT details added successful",
          data: data,
          error: null,
        });
      } else {
        res.status(400).send({
          message: "Invalid data in ASMT entry",
          data: null,
          error: null,
        });
      }
    } catch (e) {
      log(e.message);
      res.status(500).send({
        message: "An error occured",
        data: null,
        error: e.message,
      });
    }
  } else {
    res.status(400).send({
      message: "Please provide a valid SCode",
      data: null,
      error: null,
    });
  }
};
