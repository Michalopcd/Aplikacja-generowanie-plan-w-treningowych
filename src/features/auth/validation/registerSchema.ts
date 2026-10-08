import * as Yup from "yup";

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const registerSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Podaj poprawny adres e-mail.")
    .required("Email jest wymagany."),

  password: Yup.string()
    .matches(
      PASSWORD_REGEX,
      "Hasło musi mieć minimum 8 znaków, małą i wielką literę, cyfrę oraz znak specjalny.",
    )
    .required("Hasło jest wymagane."),

  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password")],
      "Hasła nie są takie same.",
    )
    .required("Powtórz hasło."),
});