import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

// Mock API calls - replace with actual API integration
const mockLogin = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUsers = [
        {
            id: '1',
            email: 'recruiter@company.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            role: 'recruiter',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        },
        {
            id: '2',
            email: 'candidate@email.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'candidate',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
        }
    ];
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    return user;
};

const mockRegister = async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const userData = await mockLogin(email, password);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData; // <-- add this line
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const newUser = await mockRegister(userData);
            setUser(newUser);
            localStorage.setItem('user', JSON.stringify(newUser));
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = { user, login, register, logout, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};