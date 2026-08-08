import type { User as FirebaseUser } from "firebase/auth";
import { doc,getDoc, setDoc,updateDoc,onSnapshot,Timestamp, type Unsubscribe } from "firebase/firestore";
import type { TrainingProfile } from "../onboarding/types/onboarding";

import { db } from "../../firebase";
import type { UserProfile } from "../../types/user";


export  class UserProfileNotFoundError extends Error {
  constructor() {
    super("Nie znaleziono profilu użytkownika.");
    this.name = "UserProfileNotFoundError";
  }
}
type FirestoreUserProfile = Omit<UserProfile, "createdAt"> & {
  createdAt: Timestamp | Date;
};

const convertFirestoreDate = (date: Timestamp | Date): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }

  return date;
};

const mapUserProfileFromFirestore = (
  userProfile: FirestoreUserProfile,
): UserProfile => {
  return {
    ...userProfile,
    createdAt: convertFirestoreDate(userProfile.createdAt),
  };
};

export const createUserProfile = async (user: FirebaseUser):Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid: user.uid,
    firstName: "",
    email: user.email ?? "",
    role: "user",
    onboardingCompleted: false,
    createdAt: new Date(),
  };

  await setDoc(doc(db, "users", user.uid), userProfile);
  return userProfile;
};
export const saveOnboardingData = async (
  uid: string,
  firstName: string,
  trainingProfile: TrainingProfile
) => {
  await updateDoc(doc(db, "users", uid), {
    firstName,
    trainingProfile,
    onboardingCompleted: true,
  });
};
export const getUserProfile = async (uid: string) => {
  const userDocument = await getDoc(doc(db, "users", uid));

  if (!userDocument.exists()) {
    throw new UserProfileNotFoundError();
  }

 return mapUserProfileFromFirestore(
  userDocument.data() as FirestoreUserProfile,
);
};


export const subscribeUserProfile = (
  uid: string,
  onUserProfileChange: (userProfile: UserProfile) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    doc(db, "users", uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onError(new UserProfileNotFoundError());
        return;
      }

      onUserProfileChange(
  mapUserProfileFromFirestore(
    snapshot.data() as FirestoreUserProfile,
  ),
);
    },
    onError,
  );
};