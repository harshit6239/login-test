const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
    credentials: true,
    methods: ["GET", "POST"],
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
