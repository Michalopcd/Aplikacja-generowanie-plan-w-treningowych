import { useRef, useState, type ChangeEvent } from "react";

import { toast } from "react-toastify";

import {
  updateProfileImage,
  uploadProfileImage,
} from "../service/profileImageService";

import type { UserProfile } from "../../../types/user";

import { Button } from "../../../ui/Button";
import { FormError } from "../../../ui/FormError";

type Props = {
  user: UserProfile;
};

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

export const ProfileAvatar = ({ user }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [uploadError, setUploadError] = useState("");

  const handleProfileImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("Wybrany plik musi być obrazem.");

      event.target.value = "";
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setUploadError("Zdjęcie może mieć maksymalnie 5 MB.");

      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const avatarUrl = await uploadProfileImage(user.uid, file);

      await updateProfileImage(user.uid, avatarUrl);

      toast.success("Zdjęcie profilowe zostało zapisane.", {
        toastId: "profile-image-updated",
      });
    } catch {
      setUploadError("Nie udało się zapisać zdjęcia profilowego.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-border bg-card">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Zdjęcie profilowe"
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-primary">
            {user.firstName?.charAt(0).toUpperCase() || "U"}
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        onChange={handleProfileImageChange}
        className="hidden"
      />

      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading
          ? "Przesyłanie..."
          : user.avatarUrl
            ? "Zmień zdjęcie"
            : "Dodaj zdjęcie"}
      </Button>

      {uploadError && <FormError>{uploadError}</FormError>}
    </div>
  );
};
