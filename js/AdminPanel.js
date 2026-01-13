// ==================== অ্যাডমিন প্যানেল ====================
function AdminPanel({ currentUser, setCurrentUser, users, setUsers, menuSchedule, setMenuSchedule, expenses, setExpenses, mealStatus, setMealStatus, isMealLocked, setIsMealLocked, today }) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showUserModal, setShowUserModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [toast, setToast] = useState(null);

    // টোস্ট নোটিফিকেশন দেখানো
    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const tabs = [
        { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: '📊' },
        { id: 'users', label: 'ইউজার', icon: '👥' },
        { id: 'menu', label: 'মেনু', icon: '📅' },
        { id: 'expenses', label: 'খরচ', icon: '💰' },
        { id: 'reports', label: 'রিপোর্ট', icon: '📈' }
    ];

    const regularUsers = users.filter(u => u.role === 'user');
    const todayMenu = menuSchedule.find(m => m.date === today);
    const isFishDay = todayMenu?.menu === 'মাছ';

    // মিল স্ট্যাটিস্টিক্স গণনা
    const getMealStats = () => {
        const dayStatus = mealStatus[today] || {};
        let totalOn = 0, totalOff = 0, fishEaters = 0, eggInstead = 0;
        
        regularUsers.forEach(user => {
            const userMealOn = dayStatus[user.id] !== false;
            if (userMealOn) {
                totalOn++;
                if (isFishDay) {
                    if (user.fishPreference === 'egg') eggInstead++;
                    else if (user.fishPreference !== 'autoOff') fishEaters++;
                }
            } else {
                totalOff++;
            }
        });
        return { totalOn, totalOff, fishEaters, eggInstead };
    };

    const stats = getMealStats();
    const totalExpense = expenses.reduce((sum, e) => sum + Number(e.price), 0);

    // মেনু যোগ - একটি তারিখে একবারই যোগ করা যাবে
    const handleAddMenu = (newMenu) => {
        const existingMenu = menuSchedule.find(m => m.date === newMenu.date);
        if (existingMenu) {
            showToast('⚠️ এই তারিখে ইতিমধ্যে মেনু আছে! এডিট করুন।', 'error');
            return false;
        }
        setMenuSchedule([...menuSchedule, newMenu]);
        showToast('✅ মেনু সফলভাবে যোগ হয়েছে!', 'success');
        return true;
    };

    // মেনু এডিট - লক থাকলে আজকের মেনু এডিট করা যাবে না
    const handleEditMenu = (updatedMenu) => {
        if (isMealLocked && updatedMenu.date === today) {
            showToast('🔒 মিল লক আছে! আজকের মেনু পরিবর্তন করা যাবে না।', 'error');
            return false;
        }
        setMenuSchedule(menuSchedule.map(m => m.date === updatedMenu.date ? updatedMenu : m));
        showToast('✅ মেনু সফলভাবে আপডেট হয়েছে!', 'success');
        return true;
    };

    // মেনু ডিলিট
    const handleDeleteMenu = (date) => {
        if (isMealLocked && date === today) {
            showToast('🔒 মিল লক আছে! আজকের মেনু ডিলিট করা যাবে না।', 'error');
            return;
        }
        setMenuSchedule(menuSchedule.filter(m => m.date !== date));
        showToast('✅ মেনু ডিলিট হয়েছে!', 'success');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
                    toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                } text-white font-medium animate-pulse`}>
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center">
                            <span className="text-xl">🍽️</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">মিল ম্যানেজমেন্ট</h1>
                            <p className="text-cyan-400 text-sm">অ্যাডমিন প্যানেল</p>
                        </div>
                    </div>
                    <button onClick={() => setCurrentUser(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors">
                        লগআউট
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                                activeTab === tab.id
                                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/25'
                                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ড্যাশবোর্ড ট্যাব */}
                {activeTab === 'dashboard' && (
                    <DashboardTab 
                        stats={stats} 
                        isMealLocked={isMealLocked} 
                        setIsMealLocked={setIsMealLocked} 
                        todayMenu={todayMenu} 
                        isFishDay={isFishDay}
                        totalExpense={totalExpense}
                        regularUsers={regularUsers}
                    />
                )}

                {/* ইউজার ট্যাব */}
                {activeTab === 'users' && (
                    <UsersTab 
                        regularUsers={regularUsers} 
                        users={users}
                        setUsers={setUsers}
                        showUserModal={showUserModal}
                        setShowUserModal={setShowUserModal}
                    />
                )}

                {/* মেনু ট্যাব */}
                {activeTab === 'menu' && (
                    <MenuTab 
                        menuSchedule={menuSchedule}
                        today={today}
                        isMealLocked={isMealLocked}
                        editingMenu={editingMenu}
                        setEditingMenu={setEditingMenu}
                        showMenuModal={showMenuModal}
                        setShowMenuModal={setShowMenuModal}
                        handleAddMenu={handleAddMenu}
                        handleEditMenu={handleEditMenu}
                        handleDeleteMenu={handleDeleteMenu}
                        showToast={showToast}
                    />
                )}

                {/* খরচ ট্যাব */}
                {activeTab === 'expenses' && (
                    <ExpensesTab 
                        expenses={expenses}
                        setExpenses={setExpenses}
                        totalExpense={totalExpense}
                        showExpenseModal={showExpenseModal}
                        setShowExpenseModal={setShowExpenseModal}
                        today={today}
                    />
                )}

                {/* রিপোর্ট ট্যাব */}
                {activeTab === 'reports' && (
                    <ReportsTab 
                        regularUsers={regularUsers}
                        stats={stats}
                        expenses={expenses}
                        totalExpense={totalExpense}
                    />
                )}
            </div>
        </div>
    );
}

// ==================== ড্যাশবোর্ড ট্যাব ====================
function DashboardTab({ stats, isMealLocked, setIsMealLocked, todayMenu, isFishDay, totalExpense, regularUsers }) {
    return (
        <div className="space-y-6">
            {/* Meal Lock Control */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">আজকের মিল কন্ট্রোল</h3>
                        <p className="text-slate-400">
                            {isMealLocked ? '🔒 মিল লক করা আছে - বাজার যাওয়া হয়েছে, মেনু ও মিল পরিবর্তন বন্ধ' : '🔓 মিল আনলক আছে - সবকিছু পরিবর্তন করা যাবে'}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsMealLocked(!isMealLocked)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all ${
                            isMealLocked
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                        } text-white`}
                    >
                        {isMealLocked ? '🔓 আনলক করুন' : '🔒 লক করুন'}
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-2xl p-5">
                    <p className="text-emerald-300 text-sm mb-1">মিল অন</p>
                    <p className="text-3xl font-black text-white">{stats.totalOn}</p>
                </div>
                <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-2xl p-5">
                    <p className="text-red-300 text-sm mb-1">মিল অফ</p>
                    <p className="text-3xl font-black text-white">{stats.totalOff}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-2xl p-5">
                    <p className="text-amber-300 text-sm mb-1">মোট খরচ</p>
                    <p className="text-3xl font-black text-white">৳{totalExpense}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-5">
                    <p className="text-purple-300 text-sm mb-1">মোট ইউজার</p>
                    <p className="text-3xl font-black text-white">{regularUsers.length}</p>
                </div>
            </div>

            {/* Fish Day Stats */}
            {isFishDay && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl p-5">
                        <p className="text-blue-300 text-sm mb-1">🐟 মাছ খাবে</p>
                        <p className="text-3xl font-black text-white">{stats.fishEaters}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-2xl p-5">
                        <p className="text-amber-300 text-sm mb-1">🥚 ডিম খাবে</p>
                        <p className="text-3xl font-black text-white">{stats.eggInstead}</p>
                    </div>
                </div>
            )}

            {/* Today's Menu */}
            {todayMenu && (
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">📅 আজকের মেনু</h3>
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

// ==================== ইউজার ট্যাব ====================
function UsersTab({ regularUsers, users, setUsers, showUserModal, setShowUserModal }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">ইউজার ম্যানেজমেন্ট</h2>
                <button
                    onClick={() => setShowUserModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:opacity-90"
                >
                    + নতুন ইউজার
                </button>
            </div>
            <div className="grid gap-4">
                {regularUsers.length === 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
                        <p className="text-slate-400">কোনো ইউজার নেই। নতুন ইউজার যোগ করুন।</p>
                    </div>
                ) : (
                    regularUsers.map(user => (
                        <div key={user.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">👤</div>
                                <div>
                                    <p className="text-lg font-bold text-white">{user.name}</p>
                                    <p className="text-slate-400">@{user.username}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    user.fishPreference === 'autoOff' ? 'bg-red-500/20 text-red-300' :
                                    user.fishPreference === 'egg' ? 'bg-amber-500/20 text-amber-300' :
                                    'bg-blue-500/20 text-blue-300'
                                }`}>
                                    {user.fishPreference === 'autoOff' ? '🚫 অটো অফ' :
                                     user.fishPreference === 'egg' ? '🥚 ডিম' : '🐟 সাধারণ'}
                                </span>
                                <button
                                    onClick={() => setUsers(users.filter(u => u.id !== user.id))}
                                    className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30"
                                >
                                    ডিলিট
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {showUserModal && (
                <UserModal
                    onClose={() => setShowUserModal(false)}
                    onSave={(newUser) => {
                        setUsers([...users, {
                            ...newUser,
                            id: Date.now(),
                            role: 'user',
                            password: '123456',
                            fishPreference: 'normal'
                        }]);
                        setShowUserModal(false);
                    }}
                />
            )}
        </div>
    );
}

// ==================== মেনু ট্যাব ====================
function MenuTab({ menuSchedule, today, isMealLocked, editingMenu, setEditingMenu, showMenuModal, setShowMenuModal, handleAddMenu, handleEditMenu, handleDeleteMenu, showToast }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">মেনু শিডিউল</h2>
                    {isMealLocked && (
                        <p className="text-amber-400 text-sm mt-1">🔒 লক আছে - আজকের মেনু পরিবর্তন করা যাবে না</p>
                    )}
                </div>
                <button
                    onClick={() => {
                        setEditingMenu(null);
                        setShowMenuModal(true);
                    }}
                    className="px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-90"
                >
                    + নতুন মেনু যোগ
                </button>
            </div>

            <div className="grid gap-4">
                {menuSchedule.length === 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
                        <p className="text-slate-400">কোনো মেনু নেই। নতুন মেনু যোগ করুন।</p>
                    </div>
                ) : (
                    menuSchedule.sort((a, b) => new Date(a.date) - new Date(b.date)).map((menu, idx) => {
                        const isToday = menu.date === today;
                        const isLocked = isMealLocked && isToday;
                        
                        return (
                            <div key={idx} className={`bg-slate-800/50 border rounded-2xl p-5 ${
                                isToday ? 'border-emerald-500/50' : 'border-slate-700/50'
                            }`}>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                                            menu.menu === 'মাছ' ? 'bg-blue-500/20' :
                                            menu.menu === 'মাংস' ? 'bg-red-500/20' : 'bg-amber-500/20'
                                        }`}>
                                            {menu.menu === 'মাছ' ? '🐟' : menu.menu === 'মাংস' ? '🍖' : '🥚'}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-white">{menu.menu}</p>
                                            <p className="text-slate-400">{menu.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-4">
                                            <p className="text-slate-300">{new Date(menu.date).toLocaleDateString('bn-BD')}</p>
                                            {isToday && <span className="text-emerald-400 text-sm">আজ</span>}
                                            {isLocked && <span className="text-amber-400 text-xs block">🔒 লক</span>}
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (isLocked) {
                                                    showToast('🔒 মিল লক আছে! আজকের মেনু এডিট করা যাবে না।', 'error');
                                                    return;
                                                }
                                                setEditingMenu(menu);
                                                setShowMenuModal(true);
                                            }}
                                            className={`px-3 py-1 rounded-lg ${
                                                isLocked 
                                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                                                    : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30'
                                            }`}
                                        >
                                            ✏️ এডিট
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMenu(menu.date)}
                                            className={`px-3 py-1 rounded-lg ${
                                                isLocked 
                                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                                                    : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                            }`}
                                        >
                                            🗑️ ডিলিট
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {showMenuModal && (
                <MenuModal
                    editingMenu={editingMenu}
                    existingDates={menuSchedule.map(m => m.date)}
                    onClose={() => {
                        setShowMenuModal(false);
                        setEditingMenu(null);
                    }}
                    onSave={(menuData) => {
                        let success;
                        if (editingMenu) {
                            success = handleEditMenu(menuData);
                        } else {
                            success = handleAddMenu(menuData);
                        }
                        if (success) {
                            setShowMenuModal(false);
                            setEditingMenu(null);
                        }
                    }}
                />
            )}
        </div>
    );
}

// ==================== খরচ ট্যাব ====================
function ExpensesTab({ expenses, setExpenses, totalExpense, showExpenseModal, setShowExpenseModal, today }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">খরচ এন্ট্রি</h2>
                <button
                    onClick={() => setShowExpenseModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:opacity-90"
                >
                    + খরচ যোগ
                </button>
            </div>
            <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-2xl p-5 mb-4">
                <p className="text-amber-300 text-sm">মোট খরচ</p>
                <p className="text-3xl font-black text-white">৳{totalExpense}</p>
            </div>
            <div className="grid gap-4">
                {expenses.length === 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
                        <p className="text-slate-400">কোনো খরচ এন্ট্রি নেই।</p>
                    </div>
                ) : (
                    expenses.map((expense, idx) => (
                        <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                                        <span className="text-xl">🛒</span>
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-white">{expense.item}</p>
                                        <p className="text-slate-400">{expense.quantity}</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-amber-400">৳{expense.price}</p>
                            </div>
                            <div className="flex gap-2">
                                {expense.isOffice && (
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">অফিস খরচ</span>
                                )}
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    expense.type === 'monthly' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                    {expense.type === 'monthly' ? 'মাসিক' : 'দৈনিক'}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {showExpenseModal && (
                <ExpenseModal
                    onClose={() => setShowExpenseModal(false)}
                    onSave={(newExpense) => {
                        setExpenses([...expenses, { ...newExpense, date: today }]);
                        setShowExpenseModal(false);
                    }}
                />
            )}
        </div>
    );
}

// ==================== রিপোর্ট ট্যাব ====================
function ReportsTab({ regularUsers, stats, expenses, totalExpense }) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">রিপোর্ট ও হিসাব</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">📊 মিল সামারি</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-400">মোট ইউজার</span>
                            <span className="text-white font-bold">{regularUsers.length} জন</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">আজ মিল অন</span>
                            <span className="text-emerald-400 font-bold">{stats.totalOn} জন</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">আজ মিল অফ</span>
                            <span className="text-red-400 font-bold">{stats.totalOff} জন</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4">💰 খরচের হিসাব</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-slate-400">মোট খরচ</span>
                            <span className="text-amber-400 font-bold">৳{totalExpense}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">দৈনিক খরচ</span>
                            <span className="text-white font-bold">
                                ৳{expenses.filter(e => e.type === 'daily').reduce((s, e) => s + Number(e.price), 0)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">মাসিক খরচ</span>
                            <span className="text-white font-bold">
                                ৳{expenses.filter(e => e.type === 'monthly').reduce((s, e) => s + Number(e.price), 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
