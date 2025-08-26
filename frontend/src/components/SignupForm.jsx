import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/api";

const SignupForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ name, email, password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup Failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black w-screen">
            <h2 className={"text-7xl font-bold pb-8"}>Signup</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    className="border-b-2 border-gray-300 rounded-md p-2 w-80"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    className="border-b-2 border-gray-300 rounded-md p-2 w-80"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="border-b-2 border-gray-300 rounded-md p-2 w-80"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2  rounded-3xl my-4"
                >
                    Signup
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                <Link to="/login">Already have an account? Login</Link>
            </p>
        </div>
    );
};

export default SignupForm;
