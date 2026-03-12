import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3001";

interface User {
  id?: number;
  email: string;
  password: string;
  role: "user" | "admin";
  fullName?: string;
  phone?: string;
  gender?: string;
  location?: string;
  state?: string;
  dob?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  role: "user" | "admin";
  fullName: string;
  phone: string;
  gender: string;
  location: string;
  state: string;
  dob: string;
}

export interface UpdateProfileData {
  fullName: string;
  phone: string;
  gender: string;
  location: string;
  state: string;
  dob: string;
  oldPassword?: string;
  newPassword?: string;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData) => Promise<boolean>;
  updateProfile: (data: UpdateProfileData) => Promise<"success" | "wrong_password" | "error">;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) setUser(JSON.parse(storedUser));
    setAuthLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const [usersRes, adminRes] = await Promise.all([
        axios.get<User[]>(`${API_URL}/users?email=${email}`).catch(() => ({ data: [] })),
        axios.get<User[]>(`${API_URL}/admin?email=${email}`).catch(() => ({ data: [] })),
      ]);
      const foundUser =
        usersRes.data.find((u) => u.password === password) ||
        adminRes.data.find((u) => u.password === password);
      if (!foundUser) return false;
      setUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const [userCheck, adminCheck] = await Promise.all([
        axios.get<User[]>(`${API_URL}/users?email=${data.email}`).catch(() => ({ data: [] })),
        axios.get<User[]>(`${API_URL}/admin?email=${data.email}`).catch(() => ({ data: [] })),
      ]);
      if (userCheck.data.length > 0 || adminCheck.data.length > 0) return false;
      const newUser = { ...data };
      const endpoint = data.role === "admin" ? `${API_URL}/admin` : `${API_URL}/users`;
      const createRes = await axios.post<User>(endpoint, newUser);
      setUser(createRes.data);
      localStorage.setItem("currentUser", JSON.stringify(createRes.data));
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  const updateProfile = async (data: UpdateProfileData): Promise<"success" | "wrong_password" | "error"> => {
    if (!user?.id) return "error";
    try {
      // If changing password, verify old password first
      if (data.newPassword) {
        if (data.oldPassword !== user.password) return "wrong_password";
      }

      const endpoint = user.role === "admin" ? `${API_URL}/admin` : `${API_URL}/users`;
      const updatedFields: Partial<User> = {
        fullName: data.fullName,
        phone: data.phone,
        gender: data.gender,
        location: data.location,
        state: data.state,
        dob: data.dob,
        ...(data.newPassword ? { password: data.newPassword } : {}),
      };

      await axios.patch(`${endpoint}/${user.id}`, updatedFields);

      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return "success";
    } catch (err) {
      console.error("Update error:", err);
      return "error";
    }
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};