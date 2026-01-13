// ==================== মেইন অ্যাপ ====================
function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState(() => getStoredData('meal_users', initialUsers));
    const [menuSchedule, setMenuSchedule] = useState(() => getStoredData('meal_menu', initialMenuSchedule));
    const [expenses, setExpenses] = useState(() => getStoredData('meal_expenses', []));
    const [mealStatus, setMealStatus] = useState(() => getStoredData('meal_status', {}));
    const [isMealLocked, setIsMealLocked] = useState(() => getStoredData('meal_locked', false));
    const today = new Date().toISOString().split('T')[0];

    // লোকাল স্টোরেজে সেভ করা
    useEffect(() => { localStorage.setItem('meal_users', JSON.stringify(users)); }, [users]);
    useEffect(() => { localStorage.setItem('meal_menu', JSON.stringify(menuSchedule)); }, [menuSchedule]);
    useEffect(() => { localStorage.setItem('meal_expenses', JSON.stringify(expenses)); }, [expenses]);
    useEffect(() => { localStorage.setItem('meal_status', JSON.stringify(mealStatus)); }, [mealStatus]);
    useEffect(() => { localStorage.setItem('meal_locked', JSON.stringify(isMealLocked)); }, [isMealLocked]);

    // লগইন না থাকলে লগইন স্ক্রিন দেখাও
    if (!currentUser) {
        return <LoginScreen users={users} setCurrentUser={setCurrentUser} />;
    }

    // অ্যাডমিন হলে অ্যাডমিন প্যানেল দেখাও
    if (currentUser.role === 'admin') {
        return (
            <AdminPanel
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                users={users}
                setUsers={setUsers}
                menuSchedule={menuSchedule}
                setMenuSchedule={setMenuSchedule}
                expenses={expenses}
                setExpenses={setExpenses}
                mealStatus={mealStatus}
                setMealStatus={setMealStatus}
                isMealLocked={isMealLocked}
                setIsMealLocked={setIsMealLocked}
                today={today}
            />
        );
    }

    // ইউজার হলে ইউজার প্যানেল দেখাও
    return (
        <UserPanel
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            users={users}
            setUsers={setUsers}
            menuSchedule={menuSchedule}
            expenses={expenses}
            mealStatus={mealStatus}
            setMealStatus={setMealStatus}
            isMealLocked={isMealLocked}
            today={today}
        />
    );
}

// ==================== রেন্ডার ====================
ReactDOM.render(<App />, document.getElementById('root'));
