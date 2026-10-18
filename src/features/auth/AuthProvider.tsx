import { useEffect, useState, type ReactNode } from "react";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../firebase";

import { AuthContext } from "./AuthContext";

import { createUserProfile, subscribeUserProfile } from "./profileService";
import { loginUser, logoutUser, registerUser } from "./Authservice";

import type { UserProfile } from "../../types/user";

type Props = {
  children: ReactNode;
};

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
