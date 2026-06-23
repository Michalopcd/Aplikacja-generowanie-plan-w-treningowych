import type { UserProfile } from "../../../types/user";

type Props = {
  user: UserProfile;
};

export function Header({ user }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="text-lg text-white">
        Cześć{" "}
        <strong className="font-semibold">
        {user.firstName}
        </strong>
        </p>

        <p className="text-sm text-muted">
          Gotowy na kolejny trening?
        </p>
      </div>

      <div>
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar użytkownika"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
            {user.firstName?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}
      </div>
    </header>
  );
}