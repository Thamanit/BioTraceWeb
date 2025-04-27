import express from "express";
import { login, register, verify, logout } from "../controllers/auth.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post("/logout", verifyToken, logout)
router.get("/validate", verifyToken, verify)

export default router