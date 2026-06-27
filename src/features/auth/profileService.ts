import type { User as FirebaseUser } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { db } from "../../firebase";
import type { UserProfile } from "../../types/user";

export const createUserProfile = async (user: FirebaseUser) => {
  const userProfile: UserProfile = {
    uid: user.uid,
    userName: "",
    email: user.email ?? "",
    role: "user",
    onboardingCompleted: false,
    createdAt: new Date(),
  };

  await setDoc(doc(db, "users", user.uid), userProfile);
};