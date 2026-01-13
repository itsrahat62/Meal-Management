// ==================== লগইন স্ক্রিন ====================
function LoginScreen({ users, setCurrentUser }) {
    const [loginType, setLoginType] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // লগইন হ্যান্ডলার
    const handleLogin = () => {
        const user = users.find(u => 
            u.username === username && 
            u.password === password && 
            (loginType === 'admin' ? u.role === 'admin' : u.role === 'user')
        );
        if (user) {
            setCurrentUser(user);
        } else {
            setError('ইউজারনেম বা পাসওয়ার্ড ভুল হয়েছে');
        }
    };

    // লগইন টাইপ সিলেক্ট স্ক্রিন
    if (!loginType) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
                <div className="relative z-10 text-center">
                    <div className="mb-12">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl shadow-2xl shadow-emerald-500/30 mb-6">
                            <span className="text-4xl">🍽️</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 mb-3">
                            মিল ম্যানেজমেন্ট
                        </h1>
                        <p className="text-teal-400/70 text-lg">আপনার মেসের সম্পূর্ণ হিসাব এক জায়গায়</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => setLoginType('user')}
                            className="group relative px-10 py-6 bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-2 border-emerald-500/30 rounded-2xl hover:border-emerald-400 transition-all"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">👤</span>
                            </div>
                            <span className="text-emerald-200 text-xl font-bold block">ইউজার লগইন</span>
                            <span className="text-emerald-400/60 text-sm">মিল অন/অফ করুন</span>
                        </button>
                        <button
                            onClick={() => setLoginType('admin')}
                            className="group relative px-10 py-6 bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-2 border-cyan-500/30 rounded-2xl hover:border-cyan-400 transition-all"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">👨‍💼</span>
                            </div>
                            <span className="text-cyan-200 text-xl font-bold block">অ্যাডমিন লগইন</span>
                            <span className="text-cyan-400/60 text-sm">পূর্ণ নিয়ন্ত্রণ</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // লগইন ফর্ম
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950 flex items-center justify-center p-4">
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                    <button onClick={() => setLoginType(null)} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2">
                        <span>←</span> পেছনে যান
                    </button>
                    <div className="text-center mb-8">
                        <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${loginType === 'admin' ? 'from-cyan-400 to-cyan-600' : 'from-emerald-400 to-emerald-600'} rounded-2xl flex items-center justify-center`}>
                            <span className="text-3xl">{loginType === 'admin' ? '👨‍💼' : '👤'}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{loginType === 'admin' ? 'অ্যাডমিন' : 'ইউজার'} লগইন</h2>
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-6 text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">ইউজারনেম</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                                placeholder="ইউজারনেম লিখুন"
                            />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">পাসওয়ার্ড</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                                placeholder="পাসওয়ার্ড লিখুন"
                            />
                        </div>
                        <button
                            onClick={handleLogin}
                            className={`w-full py-4 bg-gradient-to-r ${loginType === 'admin' ? 'from-cyan-500 to-cyan-600' : 'from-emerald-500 to-emerald-600'} text-white font-bold rounded-xl hover:opacity-90 transition-opacity`}
                        >
                            লগইন করুন
                        </button>
                    </div>
                    
                    {loginType === 'admin' && (
                        <p className="text-center text-slate-500 text-sm mt-6">ডিফল্ট: admin / admin</p>
                    )}
                    {loginType === 'user' && (
                        <p className="text-center text-slate-500 text-sm mt-6">ডিফল্ট পাসওয়ার্ড: 123456</p>
                    )}
                </div>
            </div>
        </div>
    );
}
