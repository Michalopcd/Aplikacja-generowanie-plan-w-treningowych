import {useEffect, useRef, useState,} from "react";
import { Link } from "react-router-dom";

import { LogOut, Menu, User,} from "lucide-react";

import type { UserProfile } from "../../../types/user";
import { useAuth } from "../../../features/auth/AuthContext";
import { Button } from "../../../ui/Button";

type Props = {
  user: UserProfile;
  onMenuClick: () => void;
};

export function Header({
  user,
  onMenuClick,
}: Props) {
  const { logout } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] =
    useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserMenuOpen) {
      return;
    }

    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);

    try {
      await logout();
    } catch (error) {
      console.error(
        "Błąd podczas wylogowania:",
        error,
      );
    }
  };

  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between bg-nav px-4 py-4 md:px-6 xl:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="iconGhost"
          onClick={onMenuClick}
          aria-label="Otwórz menu"
          className="flex h-12 w-12 items-center justify-center p-0 sm:h-14 sm:w-14 md:hidden"
        >
          <Menu className="h-7 w-7 sm:h-8 sm:w-8" />
        </Button>

        <div className="min-w-0">
          <p className="truncate text-base text-white sm:text-lg">
            Cześć{" "}
            <strong className="font-semibold">
              {user.firstName}
            </strong>
          </p>

          <p className="mt-0.5 truncate text-xs text-muted sm:text-sm">
            Gotowy na kolejny trening?
          </p>
        </div>
      </div>

      <div
        ref={userMenuRef}
        className="relative shrink-0"
      >
        <button
          type="button"
          onClick={() =>
            setIsUserMenuOpen(
              (currentIsUserMenuOpen) =>
                !currentIsUserMenuOpen,
            )
          }
          aria-label="Otwórz menu użytkownika"
          aria-expanded={isUserMenuOpen}
          className="cursor-pointer rounded-full transition duration-200 hover:scale-105 hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-nav"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Avatar użytkownika"
              className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-semibold text-white sm:h-12 sm:w-12">
              {user.firstName
                ?.charAt(0)
                .toUpperCase() ?? "U"}
            </div>
          )}
        </button>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-full z-[200] mt-2 w-52 rounded-xl border border-border bg-surface p-2 shadow-xl">
            <Link
              to="/profile"
              onClick={() =>
                setIsUserMenuOpen(false)
              }
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              <User className="h-4 w-4" />
              Przejdź do profilu
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Wyloguj się
            </button>
          </div>
        )}
      </div>
    </header>
  );
}