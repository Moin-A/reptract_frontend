"use client";

import { createContext, useContext } from "react";

type User = {
  id: number;
  name: string;
  email: string;
};

const AuthContext = createContext<User | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  return <AuthContext.Provider value={initialUser}>{children}</AuthContext.Provider>;
}

export function useAuth(): User | null {
  return useContext(AuthContext);
}
