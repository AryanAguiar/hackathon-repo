import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/api';

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
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Signup</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}

export default SignupForm