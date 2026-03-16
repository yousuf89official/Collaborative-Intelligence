'use client';
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { type User } from "../services/api";
import { useSession, signIn, signOut } from "next-auth/react";

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
    hasPermission: (allowedRoles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();

    // Map session user to App User type
    const user: User | null = session?.user ? {
        id: session.user.id as string,
        name: session.user.name as string,
        email: session.user.email as string,
        role: (session.user as any).role || 'user', // Ensure role is passed in session
        avatar: (session.user as any).image // mapping image to avatar if needed
    } as User : null;

    const isLoading = status === 'loading';

    const login = async (email: string, password: string): Promise<boolean> => {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        });

        if (result?.error) {
            return false;
        }
        return true;
    };

    const logout = async () => {
        await signOut({ redirect: false });
    };

    const hasPermission = (allowedRoles: string[]) => {
        if (!user) return false;
        return allowedRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
