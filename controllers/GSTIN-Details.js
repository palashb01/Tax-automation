import {
  fetchGSTINDetails,
  toggleActionRequired,
  writeReview,
  writeStatus,
} from "../models/GSTIN.js";

export const getGSTINDetails = async (req, res, next) => {
  console.log("FETCH DETAILS");
  const { GSTIN } = req.query;
  if (GSTIN) {
    try {
      const data = await fetchGSTINDetails(GSTIN);
      if (data && data.GSTIN.toLowerCase() == GSTIN.toLowerCase()) {
        console.log("DETAILS SENT");
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

export const postStatus = async (req, res, next) => {
  console.log("UPDATE GSTIN");
  const { id, ...updatedObj } = req.body;

  if (id) {
    try {
      if (Object.keys(updatedObj).length != 0) {
        let parsedID = null;
        try {
          parsedID = parseInt(id);
        } catch (e) {
          res.status(400).send({
            message: "Please provide a valid ID as Integer",
            data: null,
            error: e,
          });
        }
        if (parsedID) {
          const data = await writeStatus(parsedID, updatedObj);
          res.status(200).send({
            message: "Wrote successful",
            data: (({ review, action, viewed }) => ({
              review,
              action,
              viewed,
            }))(data),
            error: null,
          });
        } else {
          res.status(400).send({
            message: "Please provide a valid ID as Integer",
            data: null,
            error: null,
          });
        }
      } else {
        res.status(400).send({
          message: "No valid Note send. please send a valid updatable field",
          data: null,
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
      message: "Please provide a valid ID",
      data: null,
      error: null,
    });
  }
}

export const postReview = async (req, res, next) => {
  console.log("WRITE REVIEW");
  const { id, review } = req.body;

  if (id) {
    try {
      if (review) {
        let parsedID = null;
        try {
          parsedID = parseInt(id);
        } catch (e) {
          res.status(400).send({
            message: "Please provide a valid ID as Integer",
            data: null,
            error: e,
          });
        }
        if (parsedID) {
          const data = await writeReview(parsedID, review);
          res.status(200).send({
            message: "Wrote successful",
            data: data,
            error: null,
          });
        } else {
          res.status(400).send({
            message: "Please provide a valid ID as Integer",
            data: null,
            error: null,
          });
        }
      } else {
        res.status(400).send({
          message: "No valid Note send. please send a valid `review` field",
          data: null,
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
      message: "Please provide a valid ID",
      data: null,
      error: null,
    });
  }
};

export const postActionRequired = async (req, res) => {
  console.log("ACTION REQUIRED");
  const { id, action } = req.body;

  if (id) {
    try {
      if (action) {
        if (typeof action !== "boolean") {
          return res.status(400).send({
            message: "Please send a valid boolean `action` field",
            data: null,
            error: null,
          });
        }
        let parsedID = null;
        try {
          parsedID = parseInt(id);
        } catch (e) {
          res.status(400).send({
            message: "Please provide a valid ID as Integer",
            data: null,
            error: e,
          });
        }
        if (parsedID) {
          const data = await toggleActionRequired(parsedID, action);
          res.status(200).send({
            message: "`Action required` added successful",
            data: data,
            error: null,
          });
        } else {
          res.status(400).send({
            message: "Please provide a valid ID as Integer",
            data: null,
            error: null,
          });
        }
      } else {
        res.status(400).send({
          message:
            "No valid action send. please send a valid boolean `action` field",
          data: null,
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
      message: "Please provide a valid ID",
      data: null,
      error: null,
    });
  }
};
