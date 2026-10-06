import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase";

import { createUserProfile, subscribeUserProfile } from "./profileService";
import { loginUser, logoutUser, registerUser } from "./Authservice";

import type { UserProfile } from "../../types/user";

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribeUserProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (unsubscribeUserProfile) {
        unsubscribeUserProfile();
        unsubscribeUserProfile = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setIsLoading(false);

        return;
      }

      setIsLoading(true);

      unsubscribeUserProfile = subscribeUserProfile(
        firebaseUser.uid,
        (userProfile) => {
          setUser(userProfile);
          setIsLoading(false);
        },
        () => {
          setUser(null);
          setIsLoading(false);
        },
      );
    });

    return () => {
      unsubscribeAuth();

      if (unsubscribeUserProfile) {
        unsubscribeUserProfile();
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    await loginUser(email, password);
  };

  const register = async (email: string, password: string): Promise<void> => {
    const userCredential = await registerUser(email, password);

    await createUserProfile(userCredential.user);
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
