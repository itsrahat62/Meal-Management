// ==================== ইউজার প্যানেল ====================
function UserPanel({ currentUser, setCurrentUser, users, setUsers, menuSchedule, mealStatus, setMealStatus, isMealLocked, today }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showLockNotice, setShowLockNotice] = useState(false);
    const [pendingPreference, setPendingPreference] = useState(null);

    const tabs = [
        { id: 'dashboard', label: 'হোম', icon: '🏠' },
        { id: 'meal', label: 'মিল', icon: '🍽️' },
        { id: 'menu', label: 'মেনু', icon: '📅' },
        { id: 'profile', label: 'প্রোফাইল', icon: '👤' }
    ];

    const todayMenu = menuSchedule.find(m => m.date === today);
    const userMealStatus = mealStatus[today]?.[currentUser.id] !== false;

    // মিল অন/অফ টগল
    const toggleMeal = (date) => {
        if (isMealLocked && date === today) return;
        setMealStatus(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [currentUser.id]: !(prev[date]?.[currentUser.id] !== false)
            }
        }));
    };

    // মাছের দিন পছন্দ আপডেট - লক থাকলে নোটিশ দেখাবে
    const updateFishPreference = (pref) => {
        if (isMealLocked) {
            setPendingPreference(pref);
            setShowLockNotice(true);
        } else {
            setUsers(users.map(u => u.id === currentUser.id ? { ...u, fishPreference: pref } : u));
        }
    };

    // লক নোটিশ কনফার্ম করলে পছন্দ সেভ হবে
    const confirmPreferenceChange = () => {
        if (pendingPreference) {
            setUsers(users.map(u => u.id === currentUser.id ? { ...u, fishPreference: pendingPreference } : u));
        }
        setShowLockNotice(false);
        setPendingPreference(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🍽️</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white">{currentUser.name}</h1>
                            <p className="text-emerald-400 text-sm">স্বাগতম!</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setCurrentUser(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                    >
                        লগআউট
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
                                    : 'bg-slate-800/50 text-slate-400'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ড্যাশবোর্ড ট্যাব */}
                {activeTab === 'dashboard' && (
                    <UserDashboard 
                        userMealStatus={userMealStatus}
                        isMealLocked={isMealLocked}
                        toggleMeal={toggleMeal}
                        today={today}
                        todayMenu={todayMenu}
                    />
                )}

                {/* মিল ট্যাব */}
                {activeTab === 'meal' && (
                    <UserMealTab 
                        menuSchedule={menuSchedule}
                        mealStatus={mealStatus}
                        currentUser={currentUser}
                        isMealLocked={isMealLocked}
                        today={today}
                        toggleMeal={toggleMeal}
                    />
                )}

                {/* মেনু ট্যাব */}
                {activeTab === 'menu' && (
                    <UserMenuTab 
                        menuSchedule={menuSchedule}
                        today={today}
                    />
                )}

                {/* প্রোফাইল ট্যাব */}
                {activeTab === 'profile' && (
                    <UserProfileTab 
                        currentUser={currentUser}
                        updateFishPreference={updateFishPreference}
                        isMealLocked={isMealLocked}
                    />
                )}

                {/* লক নোটিশ পপআপ */}
                {showLockNotice && (
                    <LockNoticeModal 
                        onConfirm={confirmPreferenceChange}
                        onCancel={() => {
                            setShowLockNotice(false);
                            setPendingPreference(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}

// ==================== ইউজার ড্যাশবোর্ড ====================
function UserDashboard({ userMealStatus, isMealLocked, toggleMeal, today, todayMenu }) {
    return (
        <div className="space-y-6">
            <div className={`bg-gradient-to-br ${
                userMealStatus 
                    ? 'from-emerald-600/20 to-emerald-800/20 border-emerald-500/30' 
                    : 'from-red-600/20 to-red-800/20 border-red-500/30'
            } border rounded-2xl p-6`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <p className="text-slate-400 mb-1">আজকের মিল</p>
                        <p className={`text-3xl font-black ${userMealStatus ? 'text-emerald-400' : 'text-red-400'}`}>
                            {userMealStatus ? '✅ অন আছে' : '❌ অফ আছে'}
                        </p>
                    </div>
                    {!isMealLocked && (
                        <button
                            onClick={() => toggleMeal(today)}
                            className={`px-6 py-3 rounded-xl font-bold ${
                                userMealStatus ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
                            } text-white`}
                        >
                            {userMealStatus ? 'অফ করুন' : 'অন করুন'}
                        </button>
                    )}
                </div>
                {isMealLocked && (
                    <p className="text-amber-400 mt-3 text-sm">🔒 বাজার যাওয়ায় মিল পরিবর্তন বন্ধ আছে</p>
                )}
            </div>

            {todayMenu && (
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6">
                    <p className="text-slate-400 mb-2">আজকের মেনু</p>
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">
                            {todayMenu.menu === 'মাছ' ? '🐟' : todayMenu.menu === 'মাংস' ? '🍖' : '🥚'}
                        </span>
                        <div>
                            <p className="text-2xl font-bold text-white">{todayMenu.menu}</p>
                            <p className="text-purple-300">{todayMenu.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ==================== ইউজার মিল ট্যাব ====================
function UserMealTab({ menuSchedule, mealStatus, currentUser, isMealLocked, today, toggleMeal }) {
    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">📅 আগামী ৭ দিন</h3>
                <div className="space-y-3">
                    {Array.from({ length: 7 }).map((_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const dateStr = date.toISOString().split('T')[0];
                        const menu = menuSchedule.find(m => m.date === dateStr);
                        const isOn = mealStatus[dateStr]?.[currentUser.id] !== false;
                        const isLocked = isMealLocked && dateStr === today;

                        return (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {menu?.menu === 'মাছ' ? '🐟' : menu?.menu === 'মাংস' ? '🍖' : '🥚'}
                                    </span>
                                    <div>
                                        <p className="text-white font-medium">
                                            {date.toLocaleDateString('bn-BD', { weekday: 'long' })}
                                        </p>
                                        <p className="text-slate-400 text-sm">{menu?.menu || 'মেনু নেই'}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => !isLocked && toggleMeal(dateStr)}
                                    disabled={isLocked}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        isLocked
                                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                            : isOn
                                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                    }`}
                                >
                                    {isLocked ? '🔒' : isOn ? '✅ অন' : '❌ অফ'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ==================== ইউজার মেনু ট্যাব ====================
function UserMenuTab({ menuSchedule, today }) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">📅 এই সপ্তাহের মেনু</h3>
            {menuSchedule.sort((a, b) => new Date(a.date) - new Date(b.date)).map((menu, idx) => (
                <div key={idx} className={`bg-slate-800/50 border rounded-2xl p-5 ${
                    menu.date === today ? 'border-emerald-500/50' : 'border-slate-700/50'
                }`}>
                    <div className="flex items-center gap-4">
                        <span className="text-3xl">
                            {menu.menu === 'মাছ' ? '🐟' : menu.menu === 'মাংস' ? '🍖' : '🥚'}
                        </span>
                        <div className="flex-1">
                            <p className="text-lg font-bold text-white">{menu.menu}</p>
                            <p className="text-slate-400">{menu.description}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-slate-300 text-sm">
                                {new Date(menu.date).toLocaleDateString('bn-BD', { weekday: 'long' })}
                            </p>
                            {menu.date === today && <span className="text-emerald-400 text-xs">আজ</span>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ==================== ইউজার প্রোফাইল ট্যাব ====================
function UserProfileTab({ currentUser, updateFishPreference, isMealLocked }) {
    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl">
                        👤
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">{currentUser.name}</p>
                        <p className="text-slate-400">@{currentUser.username}</p>
                    </div>
                </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">🐟 মাছের দিন মিল পছন্দ</h3>
                    {isMealLocked && (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs">
                            🔒 আজ লক আছে
                        </span>
                    )}
                </div>
                <div className="space-y-3">
                    {[
                        { id: 'normal', label: 'সাধারণ', desc: 'মাছ থাকলেও মিল চলবে', icon: '🐟' },
                        { id: 'egg', label: 'ডিম', desc: 'মাছের বদলে ডিম খাব', icon: '🥚' },
                        { id: 'autoOff', label: 'অটো অফ', desc: 'মাছের দিন মিল অটো অফ', icon: '🚫' }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => updateFishPreference(opt.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                                currentUser.fishPreference === opt.id
                                    ? 'bg-emerald-500/20 border-2 border-emerald-500'
                                    : 'bg-slate-900/50 border-2 border-transparent hover:border-slate-600'
                            }`}
                        >
                            <span className="text-2xl">{opt.icon}</span>
                            <div className="text-left flex-1">
                                <p className="text-white font-medium">{opt.label}</p>
                                <p className="text-slate-400 text-sm">{opt.desc}</p>
                            </div>
                            {currentUser.fishPreference === opt.id && (
                                <span className="text-emerald-400 text-xl">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ==================== লক নোটিশ মোডাল ====================
function LockNoticeModal({ onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <span className="text-3xl">⚠️</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">মিল লক আছে!</h3>
                    <p className="text-slate-400">
                        আজকের জন্য মিল ইতিমধ্যে লক করা হয়েছে। 
                    </p>
                    <p className="text-amber-400 font-medium mt-2">
                        এই পরিবর্তন আজকে কার্যকর হবে না, <br/>
                        <span className="text-lg">কাল থেকে কার্যকর হবে।</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl"
                    >
                        ঠিক আছে, সেভ করুন
                    </button>
                </div>
            </div>
        </div>
    );
}
