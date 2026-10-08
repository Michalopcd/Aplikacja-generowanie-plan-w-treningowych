import type { User as FirebaseUser } from "firebase/auth";
import {
  doc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import type { Unsubscribe } from "firebase/firestore";

import { db } from "../../firebase";

import type { TrainingProfile } from "../onboarding/types/onboarding";
import type { UserProfile } from "../../types/user";

const USERS_COLLECTION = "users";

class UserProfileNotFoundError extends Error {
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

export const createUserProfile = async (
  user: FirebaseUser,
): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid: user.uid,
    firstName: "",
    email: user.email ?? "",
    role: "user",
    onboardingCompleted: false,
    createdAt: new Date(),
  };

  await setDoc(doc(db, USERS_COLLECTION, user.uid), userProfile);

  return userProfile;
};

export const saveOnboardingData = async (
  uid: string,
  firstName: string,
  trainingProfile: TrainingProfile,
): Promise<void> => {
  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    firstName,
    trainingProfile,
    onboardingCompleted: true,
  });
};

export const subscribeUserProfile = (
  uid: string,
  onUserProfileChange: (userProfile: UserProfile) => void,
  onError: (error: Error) => void,
): Unsubscribe => {
  return onSnapshot(
    doc(db, USERS_COLLECTION, uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onError(new UserProfileNotFoundError());

        return;
      }

      onUserProfileChange(
        mapUserProfileFromFirestore(snapshot.data() as FirestoreUserProfile),
      );
    },
    onError,
  );
};
