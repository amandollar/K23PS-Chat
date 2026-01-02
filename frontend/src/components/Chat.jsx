import { useState, useEffect, useContext, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

const Chat = () => {
    const { user, logout } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [activeUsers, setActiveUsers] = useState(0);
    const [showPicker, setShowPicker] = useState(false);
    const socketRef = useRef();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        // Fetch Chat History
        const fetchHistory = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL?.trim();
                const res = await axios.get(`${apiUrl}/api/chat/history`);
                setMessages(res.data);
            } catch (err) {
                console.error('Failed to fetch chat history');
            }
        };
        fetchHistory();

        const apiUrl = import.meta.env.VITE_API_URL?.trim();
        socketRef.current = io(apiUrl);
        
        // Join chat
        socketRef.current.emit('join', user.username);

        // Listen for messages
        socketRef.current.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        // Listen for active user count
        socketRef.current.on('activeUsers', (count) => {
            setActiveUsers(count);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socketRef.current.emit('sendMessage', input, () => setInput(''));
            setShowPicker(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const onEmojiClick = (emojiObject) => {
        setInput((prevInput) => prevInput + emojiObject.emoji);
    };

    if (!user) return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;

    return (
        <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden border border-white/50 relative">
                {/* Header */}
                <header className="bg-white/50 border-b border-gray-100 p-4 flex justify-between items-center backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800">K23PS Chat</h1>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                                <p className="text-xs text-gray-500 font-medium">{activeUsers} Active Users</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={handleLogout} className="text-sm font-semibold text-gray-500 hover:text-red-500 transition px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Logout
                        </button>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" onClick={() => setShowPicker(false)}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.user === user.username ? 'justify-end' : 'justify-start'}`}>
                            {msg.user !== 'System' && msg.user !== user.username && (
                                <div className="h-8 w-8 bg-gray-300 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-xs font-bold text-gray-600 mt-1">
                                    {msg.user.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className={`max-w-[80%] md:max-w-[60%] p-3 rounded-2xl shadow-sm ${
                                msg.user === user.username ? 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white rounded-br-none' : 
                                msg.user === 'System' ? 'bg-transparent text-gray-400 text-center w-full text-xs font-medium my-2 shadow-none' : 
                                'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                            }`}>
                                {msg.user !== 'System' && msg.user !== user.username && (
                                    <p className="text-[10px] font-bold text-gray-400 mb-1">{msg.user}</p>
                                )}
                                <p className={`break-words ${msg.user === 'System' ? 'text-center' : ''}`}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Emoji Picker */}
                {showPicker && (
                    <div className="absolute bottom-20 right-8 z-50 shadow-2xl rounded-2xl">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={sendMessage} className="flex gap-2 bg-gray-100 p-1.5 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500/50 transition shadow-inner">
                        <button
                            type="button"
                            onClick={() => setShowPicker(!showPicker)}
                            className="p-2 text-gray-500 hover:text-blue-500 transition rounded-lg hover:bg-gray-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onFocus={() => setShowPicker(false)}
                            className="flex-1 bg-transparent px-2 py-2 focus:outline-none text-gray-700 placeholder-gray-400"
                            placeholder="Type a message..."
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Chat;
