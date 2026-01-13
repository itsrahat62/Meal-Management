// ==================== ইউজার মোডাল ====================
function UserModal({ onClose, onSave }) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-6">নতুন ইউজার তৈরি</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">নাম</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                            placeholder="পুরো নাম"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">ইউজারনেম</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                            placeholder="ইউজারনেম"
                        />
                    </div>
                    <p className="text-slate-500 text-sm">ডিফল্ট পাসওয়ার্ড: 123456</p>
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={() => name && username && onSave({ name, username })}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl"
                    >
                        তৈরি করুন
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==================== মেনু মোডাল ====================
function MenuModal({ editingMenu, existingDates, onClose, onSave }) {
    const [date, setDate] = useState(editingMenu?.date || '');
    const [menu, setMenu] = useState(editingMenu?.menu || 'মাংস');
    const [description, setDescription] = useState(editingMenu?.description || '');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (!date) {
            setError('তারিখ সিলেক্ট করুন');
            return;
        }
        
        // নতুন মেনু যোগ করার সময় চেক - এই তারিখে আগে থেকে মেনু আছে কিনা
        if (!editingMenu && existingDates.includes(date)) {
            setError('⚠️ এই তারিখে ইতিমধ্যে মেনু আছে! অন্য তারিখ সিলেক্ট করুন।');
            return;
        }
        
        onSave({ date, menu, description });
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-6">
                    {editingMenu ? '✏️ মেনু এডিট করুন' : '➕ নতুন মেনু যোগ করুন'}
                </h3>
                
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4 text-center">
                        {error}
                    </div>
                )}
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">তারিখ</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => {
                                setDate(e.target.value);
                                setError('');
                            }}
                            disabled={!!editingMenu}
                            className={`w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white ${
                                editingMenu ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                        {editingMenu && (
                            <p className="text-slate-500 text-xs mt-1">* এডিট করার সময় তারিখ পরিবর্তন করা যাবে না</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">মেনু</label>
                        <select
                            value={menu}
                            onChange={(e) => setMenu(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                        >
                            <option value="মাছ">🐟 মাছ</option>
                            <option value="মাংস">🍖 মাংস</option>
                            <option value="ডিম">🥚 ডিম</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">বিবরণ</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                            placeholder="যেমন: রুই মাছের ঝোল"
                        />
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-xl"
                    >
                        {editingMenu ? '💾 আপডেট করুন' : '➕ যোগ করুন'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ==================== খরচ মোডাল ====================
function ExpenseModal({ onClose, onSave }) {
    const [item, setItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [isOffice, setIsOffice] = useState(false);
    const [type, setType] = useState('daily');

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-6">খরচ এন্ট্রি</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">আইটেম</label>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                            placeholder="যেমন: চাল, মাছ"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">পরিমাণ</label>
                        <input
                            type="text"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                            placeholder="যেমন: ২ কেজি"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">দাম (টাকা)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                            placeholder="১০০"
                        />
                    </div>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isOffice}
                            onChange={(e) => setIsOffice(e.target.checked)}
                            className="w-5 h-5 rounded"
                        />
                        অফিস খরচ
                    </label>
                    <div>
                        <label className="block text-slate-400 text-sm mb-2">ধরন</label>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setType('daily')}
                                className={`flex-1 py-2 rounded-xl transition-all ${
                                    type === 'daily' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                দৈনিক
                            </button>
                            <button
                                onClick={() => setType('monthly')}
                                className={`flex-1 py-2 rounded-xl transition-all ${
                                    type === 'monthly' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
                                }`}
                            >
                                মাসিক
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button 
                        onClick={onClose} 
                        className="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={() => item && price && onSave({ item, quantity, price: Number(price), isOffice, type })}
                        className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl"
                    >
                        যোগ করুন
                    </button>
                </div>
            </div>
        </div>
    );
}
