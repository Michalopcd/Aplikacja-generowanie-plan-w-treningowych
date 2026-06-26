import type { UserProfile } from "../../../types/user";
import { Menu } from "lucide-react";
import { Button } from "../../../ui/Button";
type Props = {
  user: UserProfile;
  onMenuClick:()=>void;
};


export function Header({ user,onMenuClick }: Props) {
  return (
   <header   className="sticky top-0 flex items-center justify-between px-4 py-4 bg-nav  md:px-6 xl:px-8">
      <div className="flex items-center gap-3">
       
        <Button
          type="button"
          variant="iconGhost"
          onClick={onMenuClick}
          aria-label="Otwórz menu"
          className="flex h-12 w-12 items-center justify-center p0 sm:h-14 sm:w-14  md:hidden"
        >
          <Menu className="h-7 w-7 sm:h-8 sm:w-8"/>
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

      <div className="shrink-0">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="Avatar użytkownika"
            className="h-11 w-11 rounded-full object-cover bject-cover sm:h-12 sm:w-12"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-semibold text-white cursor-pointer">
            {user.firstName?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}
        
      </div>
    </header>
  );
}