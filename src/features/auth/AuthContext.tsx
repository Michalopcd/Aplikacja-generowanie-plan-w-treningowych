import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "../../firebase";
import type { UserProfile } from "../../types/user";

import { createUserProfile,getUserProfile } from "./profileService";

import { loginUser,logoutUser,registerUser} from "./service";

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email:string,password:string)=>Promise<void>;
  register: (email:string,password:string)=>Promise<void>;
  logout: ()=>Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);


 useEffect(()=>{
  const unsubscribe=onAuthStateChanged(auth,async(firebaseUser)=>{
    try{
      if(!firebaseUser){
        setUser(null);
        return; 
      }

      const userProfile=await getUserProfile(firebaseUser.uid);

      setUser(userProfile);
    }catch{
      setUser(null);
    }finally{
      setIsLoading(false);
    }
  })
  return unsubscribe
 },[]);

 const login = async(email:string,password:string) => {
  const userCredential=await loginUser(email,password);

   const userProfile = await getUserProfile(
      userCredential.user.uid,
    );
    setUser(userProfile);
 }
 const register = async(email:string,password:string) => {
  const userCredential=await registerUser(email,password);

  const userProfile=await createUserProfile(userCredential.user);

  setUser(userProfile);

 }
 const logout = async() => {
  await logoutUser();

  setUser(null);
 }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,register,logout
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