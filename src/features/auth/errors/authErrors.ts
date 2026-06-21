const getFirebaseErrorCode = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    return String((error as { code: unknown }).code);
  }

  return "";
};

export const getAuthErrorMessage = (
  error: unknown,
  fallbackMessage = "Wystąpił błąd. Spróbuj ponownie."
) => {
  const code = getFirebaseErrorCode(error);

  switch (code) {
    case "auth/email-already-in-use":
      return "Ten adres e-mail jest zajęty.";

    case "auth/weak-password":
      return "Hasło jest zbyt słabe.";

    case "auth/invalid-email":
      return "Niepoprawny adres e-mail.";

    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Niepoprawny e-mail lub hasło.";

    default:
      return fallbackMessage;
  }
};