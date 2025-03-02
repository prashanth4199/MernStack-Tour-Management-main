import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// user registration
export const register = async (req, res) => {
    try {

        // Hashing password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,  
        });

        await newUser.save();

        res.status(200).json({ success: true, message: "Successfully created" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to create. Try again" });
    }
};

export const login = async (req, res) => {
    const email = req.body.email;
    console.log("Received email:", email);

    try {
        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
        console.log("Password match:", checkCorrectPassword);

        if (!checkCorrectPassword) {
            return res.status(401).json({ success: false, message: "Incorrect email or password" });
        }

        const { password, role, ...rest } = user._doc;
        console.log("Generating JWT token...");

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "15d" }
        );

        console.log("Token generated:", token);

        res.cookie("accessToken", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json({
            token,
            success: true,
            message: "Successfully logged in",
            data: { ...rest },
            role,
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Failed to login", error: err.message });
    }
};
