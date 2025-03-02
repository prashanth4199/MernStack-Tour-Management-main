import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

export const verifyUser = (req, res, next) => {
    console.log("User verification logic");

    if (!next || typeof next !== "function") {
        console.error("Error: next is not a function");
        return res.status(500).json({ success: false, message: "Internal server error" });
    }

    next();
};

router.post("/register", register);
router.post("/login", login);

export default router;
