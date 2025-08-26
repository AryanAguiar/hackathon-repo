import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login({ email, password }) // backend should return { token, user }
            localStorage.setItem("token", data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className='flex bg-violet-500 items-center w-screen'>

            <div className="flex flex-col items-center justify-center min-h-screen w-125 bg-black ">
                <h2 className={"text-7xl font-bold pb-8"}>Login</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4 ">
                    <input
                        className='border-b-2 border-gray-300 rounded-md p-2 w-80'
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        className='border-b-2 border-gray-300 rounded-md p-2'
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit"
                        className='bg-violet-700 hover:bg-violet-900 text-white font-bold py-2 px-4 my-4 rounded'>Login</button>
                </form>

                {error && <p style={{ color: "red" }}>{error}</p>}

                <p>
                    Don’t have an account? <Link to="/signup">Signup</Link>
                </p>
            </div>


        </div>

    )
}

export default LoginForm