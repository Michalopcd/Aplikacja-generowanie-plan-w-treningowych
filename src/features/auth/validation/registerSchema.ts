import * as Yup from "yup";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

export const registerSchema = Yup.object({
  email: Yup.string()
    .email("Podaj poprawny adres e-mail.")
    .required("Email jest wymagany."),

  password: Yup.string()
    .matches(
      passwordRegex,
      "Hasło musi mieć minimum 8 znaków, małą i wielką literę, cyfrę oraz znak specjalny.",
    )
    .required("Hasło jest wymagane."),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Hasła nie są takie same.")
    .required("Powtórz hasło."),
});
