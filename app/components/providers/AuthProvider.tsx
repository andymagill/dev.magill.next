'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface User {
	id: string;
	email: string;
	name?: string;
}

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	isSupabaseConnected: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = React.useState<User | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);
	
	// Mock Supabase connection state - could be controlled by environment variables
	const [isSupabaseConnected] = React.useState(false);

	const signIn = async (email: string, password: string): Promise<void> => {
		setIsLoading(true);
		try {
			// Mock authentication logic
			// In a real implementation, this would connect to Supabase
			await new Promise(resolve => setTimeout(resolve, 1000));
			setUser({ id: '1', email, name: 'Test User' });
		} finally {
			setIsLoading(false);
		}
	};

	const signOut = async (): Promise<void> => {
		setIsLoading(true);
		try {
			await new Promise(resolve => setTimeout(resolve, 500));
			setUser(null);
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (email: string, password: string): Promise<void> => {
		setIsLoading(true);
		try {
			// Mock registration logic
			await new Promise(resolve => setTimeout(resolve, 1000));
			setUser({ id: '1', email, name: 'New User' });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider value={{
			user,
			isLoading,
			isSupabaseConnected,
			signIn,
			signOut,
			register,
		}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}

export function useIsAuthenticated() {
	const { user } = useAuth();
	return !!user;
}

export function useShowAuthButtons() {
	const { user, isSupabaseConnected } = useAuth();
	// Hide auth buttons when user is logged in OR when Supabase is not connected
	return !user && isSupabaseConnected;
}