import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, password);
            navigate('/chat');
        } catch (err) {
            console.error(err);
            alert('Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[100dvh] p-4">
            <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-zinc-400">Join the K23PS Chat community today</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-zinc-500 transition"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-zinc-500 transition"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full py-3 px-4 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition duration-200 shadow-lg transform hover:scale-[1.02]">
                        Sign Up
                    </button>
                </form>
                <div className="text-center text-zinc-400 text-sm">
                    Already have an account? <Link to="/login" className="font-bold hover:underline text-rose-400">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
