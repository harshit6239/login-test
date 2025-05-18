const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use comma-separated origins in ALLOWED_ORIGINS env variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : ["http://localhost:5173"];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
};

console.log("CORS options:", corsOptions);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "user" && password === "password") {
        res.cookie("sessionId", "dummySessionId", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        });
        return res.status(200).json({ message: "Login successful" });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

app.get("/api/check-auth", (req, res) => {
    const { sessionId } = req.cookies;
    if (sessionId) {
        // Simulate a session check
        return res.status(200).json({ message: "Authenticated" });
    }
    return res.status(401).json({ message: "Not authenticated" });
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("sessionId", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });
    return res.status(200).json({ message: "Logout successful" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
