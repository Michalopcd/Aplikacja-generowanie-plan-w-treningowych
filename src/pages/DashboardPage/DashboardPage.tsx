import { useEffect, useState } from "react";

import { useAuth } from "../../features/auth/AuthContext";
import { getUserProfile } from "../../features/auth/profileService";
import { MainLayout } from "../layouts/MainLayout/MainLayout";
import type { UserProfile } from "../../types/user";

const DashboardPage = () => {
  const { user: authUser, isLoading: isAuthLoading } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!authUser) {
      setIsProfileLoading(false);
      return;
    }

    const loadUserProfile = async () => {
      try {
        setIsProfileLoading(true);
        setError("");

        const profile = await getUserProfile(authUser.uid);

        if (!profile) {
          setError("Nie znaleziono profilu użytkownika.");
          return;
        }

        setUserProfile(profile);
      } catch {
        setError("Nie udało się pobrać danych profilu.");
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [authUser, isAuthLoading]);

  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-card p-6 text-white">
        Ładowanie profilu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-card p-6 text-red-400">
        {error}
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  return (
    <MainLayout user={userProfile}>
      <section className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold md:text-3xl">
          Przegląd
        </h1>

        <p className="mt-1 text-sm text-muted">
          Zobacz swoje treningi i aktualny progres.
        </p>
      </section>
    </MainLayout>
  );
};

export default DashboardPage;