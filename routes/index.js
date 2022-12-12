import { Router } from "express";

import { getConnection } from "../controllers/index.js";
import { getR3BFilers } from "../controllers/GST-R3B.js";
import { getR9Filers } from "../controllers/GST-R9.js";
import { getR1Filers } from "../controllers/GST-R1.js";

const router = Router();

router.get("/r1", getR1Filers);
router.get("/r9", getR9Filers);
router.get("/r3b", getR3BFilers);
router.get("/", getConnection);

export default router;
