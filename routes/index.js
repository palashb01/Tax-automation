import { Router } from "express";

import { getConnection } from "../controllers/index.js";
import { getR3BFilers } from "../controllers/GST-R3B.js";
import { getR9Filers } from "../controllers/GST-R9.js";
import { getR1Filers, getR1Filers2 } from "../controllers/GST-R1.js";
import { getR9CFilers } from "../controllers/GST-R9C.js";
import { getGSTINDetails } from "../controllers/GSTIN-Details.js";
import { getGSTINList } from "../controllers/GSTIN-List.js";

const router = Router();

router.get("/r12", getR1Filers2);
router.get("/r1", getR1Filers);
router.get("/r9", getR9Filers);
router.get("/r9c", getR9CFilers);
router.get("/r3b", getR3BFilers);
router.get("/gstin-details", getGSTINDetails);
router.get("/gstin-list", getGSTINList);
router.get("/", getConnection);

export default router;
