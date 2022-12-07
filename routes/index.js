import { Router } from "express";

import { getConnection } from "../controllers/index.js";

const router = Router();

router.get("/", getConnection);

export default router;
