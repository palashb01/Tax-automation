import { fetchR3B } from "../models/GST-R3B.js";

export const getR3BFilers = async (req, res, next) => {
  // console.log("FETCH R3B");
  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const data = await fetchR3B(GSTIN);
      // console.log("R3B Data: ", data[0]);
      let osup_det = { txval: 0, iamt: 0, camt: 0, samt: 0, csamt: 0 };
      data.forEach((gstr3b) => {
        let sup_details = JSON.parse(gstr3b.sup_details);
        if (
          gstr3b.gstin.toLowerCase() == GSTIN.toLowerCase() &&
          sup_details != null
        ) {
          Object.keys(sup_details?.osup_det).forEach((key) => {
            if (sup_details?.osup_det) {
              osup_det[key] = osup_det[key] + (sup_details.osup_det[key] ?? 0);
            }
          });
        }
      });
      let partial_data = data[0];
      if (
        partial_data &&
        partial_data.gstin.toLowerCase() == GSTIN.toLowerCase()
      ) {
        if (partial_data.FileId) {
          partial_data.FileId = partial_data.FileId.toString();
        }

        // console.log("R3B SENT");

        res.status(200).send({
          message: "Fetch successful",
          data: { ...partial_data, total_sup_details: { osup_det } },
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
      // console.log(e.message);
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
