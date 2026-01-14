// ==================== ডাটা স্টোর ও ডাটাবেস ====================
const { useState, useEffect } = React;

// ==================== ডাটাবেস ক্লাস ====================
class MealDatabase {
    constructor() {
        this.dbName = 'MealManagementDB';
        this.initializeDB();
    }

    // ডাটাবেস ইনিশিয়ালাইজ
    initializeDB() {
        if (!localStorage.getItem('db_initialized')) {
            localStorage.setItem(this.dbName + '_users', JSON.stringify(this.getDefaultUsers()));
            localStorage.setItem(this.dbName + '_menu', JSON.stringify(this.getDefaultMenu()));
            localStorage.setItem(this.dbName + '_expenses', JSON.stringify([]));
            localStorage.setItem(this.dbName + '_mealStatus', JSON.stringify({}));
            localStorage.setItem(this.dbName + '_mealLocked', JSON.stringify(false));
            localStorage.setItem(this.dbName + '_currentUser', JSON.stringify(null));
            localStorage.setItem(this.dbName + '_adminSettings', JSON.stringify(this.getDefaultAdminSettings()));
            localStorage.setItem('db_initialized', 'true');
        }
    }

    // ডিফল্ট অ্যাডমিন সেটিংস
    getDefaultAdminSettings() {
        return {
            adminName: 'Admin',
            adminUsername: 'admin',
            adminPhone: '',
            adminEmail: '',
            hostelName: 'ছাত্রাবাস',
            notificationEnabled: true,
            autoLockTime: '10:00', // সকাল ১০টা
            dailyReportEmail: false
        };
    }

    // ডিফল্ট ইউজার
    getDefaultUsers() {
        return [
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
    }

    // ডিফল্ট মেনু
    getDefaultMenu() {
        return [
            { date: '2025-01-14', menu: 'মাংস', description: 'গরুর মাংস ভুনা' },
            { date: '2025-01-15', menu: 'মাছ', description: 'রুই মাছের ঝোল' },
            { date: '2025-01-16', menu: 'ডিম', description: 'ডিম ভাজি ও সবজি' },
            { date: '2025-01-17', menu: 'মাংস', description: 'মুরগির রোস্ট' },
            { date: '2025-01-18', menu: 'মাছ', description: 'ইলিশ ভাপা' },
            { date: '2025-01-19', menu: 'ডিম', description: 'ডিম কারি' },
            { date: '2025-01-20', menu: 'মাংস', description: 'খাসির মাংস' },
        ];
    }

    // ডাটা পড়া
    getData(table) {
        try {
            const data = localStorage.getItem(this.dbName + '_' + table);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    // ডাটা সংরক্ষণ
    setData(table, data) {
        try {
            localStorage.setItem(this.dbName + '_' + table, JSON.stringify(data));
        } catch (e) {
            console.error('ডাটাবেস সংরক্ষণ ব্যর্থ:', e);
        }
    }

    // কারেন্ট ইউজার সংরক্ষণ
    saveCurrentUser(user) {
        this.setData('currentUser', user);
    }

    // কারেন্ট ইউজার পড়া
    getCurrentUser() {
        return this.getData('currentUser');
    }

    // অ্যাডমিন সেটিংস সংরক্ষণ
    saveAdminSettings(settings) {
        this.setData('adminSettings', settings);
    }

    // অ্যাডমিন সেটিংস পড়া
    getAdminSettings() {
        return this.getData('adminSettings') || this.getDefaultAdminSettings();
    }

    // অ্যাডমিন প্রোফাইল আপডেট
    updateAdminProfile(adminData) {
        const settings = this.getAdminSettings();
        const updated = {
            ...settings,
            ...adminData
        };
        this.saveAdminSettings(updated);
        return updated;
    }
}

// ডাটাবেস ইন্সটেন্স
const db = new MealDatabase();

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
const initialUsers = db.getData('users') || [
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
const initialMenuSchedule = db.getData('menu') || [
    { date: '2025-01-14', menu: 'মাংস', description: 'গরুর মাংস ভুনা' },
    { date: '2025-01-15', menu: 'মাছ', description: 'রুই মাছের ঝোল' },
    { date: '2025-01-16', menu: 'ডিম', description: 'ডিম ভাজি ও সবজি' },
    { date: '2025-01-17', menu: 'মাংস', description: 'মুরগির রোস্ট' },
    { date: '2025-01-18', menu: 'মাছ', description: 'ইলিশ ভাপা' },
    { date: '2025-01-19', menu: 'ডিম', description: 'ডিম কারি' },
    { date: '2025-01-20', menu: 'মাংস', description: 'খাসির মাংস' },
];
