import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/chat');
        } catch (err) {
            console.error(err);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[100dvh] p-4">
            <div className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-zinc-400">Sign in to continue to K23PS Chat</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-1">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder-zinc-500 transition"
                            placeholder="Enter your username"
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
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full py-3 px-4 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 transition duration-200 shadow-lg transform hover:scale-[1.02]">
                        Sign In
                    </button>
                </form>
                <div className="text-center text-zinc-400 text-sm">
                    Don't have an account? <Link to="/register" className="font-bold hover:underline text-rose-400">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
