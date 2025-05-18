import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const axiosInstance = axios.create({
        baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
        withCredentials: true,
    });

    useEffect(() => {
        // Check login status on mount by calling backend
        const checkAuth = async () => {
            try {
                await axiosInstance.get("/check-auth");
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axiosInstance.post("/login", {
                username,
                password,
            });
            setIsLoggedIn(true);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/logout");
        } catch {
            setError("Logout failed");
        }
        setIsLoggedIn(false);
        setUsername("");
        setPassword("");
    };

    if (loading) return <div>Loading...</div>;

    return (
        <>
            {isLoggedIn ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <form
                    onSubmit={handleLogin}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1em",
                        maxWidth: 300,
                        margin: "0 auto",
                    }}
                >
                    <h2>Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                    {error && <div style={{ color: "red" }}>{error}</div>}
                </form>
            )}
        </>
    );
}

export default App;
