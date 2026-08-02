import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Podaj poprawny adres e-mail.")
    .required("Email jest wymagany."),

  password: Yup.string()
    .required("Hasło jest wymagane."),
});