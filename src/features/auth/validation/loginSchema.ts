import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Podaj poprawny adres e-mail.")
    .required("Email jest wymagany."),

  password: Yup.string()
    .min(6, "Hasło musi mieć minimum 6 znaków.")
    .required("Hasło jest wymagane."),
});