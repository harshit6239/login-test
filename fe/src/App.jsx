import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const baseurl = `${import.meta.env.VITE_BACKEND_URL}/api`;

    useEffect(() => {
        // Check login status on mount by calling backend
        const checkAuth = async () => {
            try {
                await axios.get(`${baseurl}/check-auth`, {
                    withCredentials: true,
                });
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
            await axios.post(
                `${baseurl}/login`,
                { username, password },
                { withCredentials: true }
            );
            setIsLoggedIn(true);
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post(
                `${baseurl}/logout`,
                {},
                { withCredentials: true }
            );
            setIsLoggedIn(false);
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
