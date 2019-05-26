import { Router } from "express";
import tokopedia from "../controllers/tokopedia";

const router = Router();

router.get("/tokopedia", tokopedia.index);

export default router;
