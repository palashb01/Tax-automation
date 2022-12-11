import { Router } from "express";

import { getR9Filers } from "../controllers/GST-R9.js";
import { getConnection } from "../controllers/index.js";

const router = Router();

router.get("/r9", getR9Filers);
router.get("/", getConnection);

export default router;
