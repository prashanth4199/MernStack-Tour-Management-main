import express from "express";
import { createBooking, getAllBooking, getBooking } from "../controllers/bookingController.js";  
import { verifyUser } from "../routes/auth.js"; // If using authentication
import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyUser, createBooking);  // POST request to create a booking
router.get("/:id", verifyUser, getBooking);   // GET request to fetch a single booking by ID
router.get("/", verifyAdmin, getAllBooking);  // GET request to fetch all bookings (Admin only)

export default router;
