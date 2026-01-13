// ==================== ডাটা স্টোর ====================
const { useState, useEffect } = React;

// লোকাল স্টোরেজ থেকে ডাটা পড়া
const getStoredData = (key, defaultValue) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
};

// ডিফল্ট ইউজার লিস্ট
const initialUsers = [
    { 
        id: 1, 
        name: 'Admin', 
        username: 'admin', 
        password: 'admin', 
        role: 'admin', 
        fishPreference: 'normal', 
        mealBalance: 0 
    }
];

// ডিফল্ট মেনু শিডিউল
const initialMenuSchedule = [
    { date: '2025-01-14', menu: 'মাংস', description: 'গরুর মাংস ভুনা' },
    { date: '2025-01-15', menu: 'মাছ', description: 'রুই মাছের ঝোল' },
    { date: '2025-01-16', menu: 'ডিম', description: 'ডিম ভাজি ও সবজি' },
    { date: '2025-01-17', menu: 'মাংস', description: 'মুরগির রোস্ট' },
    { date: '2025-01-18', menu: 'মাছ', description: 'ইলিশ ভাপা' },
    { date: '2025-01-19', menu: 'ডিম', description: 'ডিম কারি' },
    { date: '2025-01-20', menu: 'মাংস', description: 'খাসির মাংস' },
];
