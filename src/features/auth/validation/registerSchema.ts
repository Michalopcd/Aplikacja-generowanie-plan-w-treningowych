import * as Yup from "yup";

export const registerSchema = Yup.object({
  email: Yup.string()
    .email("Podaj poprawny adres e-mail.")
    .required("Email jest wymagany."),

  password: Yup.string()
    .min(6, "Hasło musi mieć minimum 6 znaków.")
    .required("Hasło jest wymagane."),

  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      "Hasła nie są takie same."
    )
    .required("Powtórz hasło."),
});