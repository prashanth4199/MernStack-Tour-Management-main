import Booking from "../models/Booking.js";

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();

        res.status(200).json({
            success: true,
            message: "Your tour is booked",
            data: savedBooking,
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Get a single booking
export const getBooking = async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Booking.findById(id);

        res.status(200).json({
            success: true,
            message: "Successful",
            data: book,
        });
    } catch (err) {
        res.status(404).json({ success: false, message: "Not found" });
    }
};

// Get all bookings (Fixed)
export const getAllBooking = async (req, res) => {
    try {
        const books = await Booking.find(); // Fetch all bookings

        res.status(200).json({
            success: true,
            message: "Successful",
            data: books, // Use `books` instead of `book`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
