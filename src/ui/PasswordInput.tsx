import { useState } from "react";
import type { InputHTMLAttributes } from "react";

import { Eye, EyeOff } from "lucide-react";

import { Input } from "./Input";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export function PasswordInput({
  className = "",
  error,
  ...props
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        error={error}
        className={`w-full pr-10 ${className}`}
      />

      <button
        type="button"
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3 top-6 -translate-y-1/2 cursor-pointer text-zinc-400 transition hover:text-white"
        aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}