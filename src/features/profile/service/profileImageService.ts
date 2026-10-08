import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { db, storage } from "../../../firebase";

export const uploadProfileImage = async (
  userId: string,
  file: File,
): Promise<string> => {
  const imageRef = ref(storage, `profile-images/${userId}/avatar`);

  await uploadBytes(imageRef, file, {
    contentType: file.type,
  });

  return getDownloadURL(imageRef);
};

export const updateProfileImage = async (
  userId: string,
  avatarUrl: string,
): Promise<void> => {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, {
    avatarUrl,
  });
};
