import { Router } from "express";

import { getConnection } from "../controllers/index.js";
import { getR3BFilers } from "../controllers/GST-R3B.js";
import { getR9Filers } from "../controllers/GST-R9.js";
import { getR1Filers } from "../controllers/GST-R1.js";
import { getR9CFilers } from "../controllers/GST-R9C.js";
import { getGSTINList } from "../controllers/GSTIN-List.js";
import {
  getGSTINDetails,
  postActionRequired,
  postReview,
  postStatus,
  postViewed,
} from "../controllers/GSTIN-Details.js";
import { postMISData, postResetValues } from "../controllers/ASMT-10.js";

const router = Router();

// router.get("/r12", getR1Filers2);
router.get("/r1", getR1Filers);
router.get("/r9", getR9Filers);
router.get("/r9c", getR9CFilers);
router.get("/r3b", getR3BFilers);
router.get("/gstin-details", getGSTINDetails);
router.get("/gstin-list", getGSTINList);
router.get("/", getConnection);

router.post("/post-review", postReview);
router.post("/post-status", postStatus);
router.post("/post-viewed", postViewed);
router.post("/action-required", postActionRequired);

// MIS 
router.post("/asmt-10", postMISData);

router.post("/dev/top-secret/asmt-10/reset", postResetValues);


export default router;
