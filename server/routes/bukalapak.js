import { Router } from "express";
import bukalapak from "../controllers/bukalapak";

const router = Router();

router.get("/bukalapak", bukalapak.index);

export default router;
