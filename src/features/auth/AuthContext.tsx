import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
  type User,
  type UserProfile,
} from "firebase/auth";

import { auth } from "../../firebase";
import { createUserProfile } from "./profileService";
import { loginUser, registerUser } from "./service";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(
  null
);
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const register = (login, pass) => {
    const userCredential = await registerUser(values.email, values.password);

    await createUserProfile(userCredential.user);
  }

  const login = async (login, pass) => {
    const fbUser = await loginUser(values.email, values.password);

  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        //pobieranie profilu usera
        setUser(userProfile)
        // nie setUser(currentUser);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);


  return (
    <AuthContext.Provider
      value={{
        register,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}