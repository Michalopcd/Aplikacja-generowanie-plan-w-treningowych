import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "./Input";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({
  className = "",
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full pr-10 ${className}`}
      />

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-white"
        aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}