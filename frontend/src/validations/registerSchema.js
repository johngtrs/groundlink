import * as yup from 'yup';

export const registerSchema = yup.object({
  type: yup.string().required('Veuillez sélectionner un type.'),
  name: yup
    .string()
    .required('Le nom est requis.')
    .min(2, 'Le nom doit contenir au moins 2 caractères.'),
  email: yup.string().required('L’adresse e-mail est requise.').email('Adresse e-mail invalide.'),
  password: yup
    .string()
    .required('Le mot de passe est requis.')
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Les mots de passe ne correspondent pas.')
    .required('La confirmation du mot de passe est requise.'),
});
