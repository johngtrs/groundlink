import * as yup from 'yup';

export const profileSchema = yup.object({
  name: yup
    .string()
    .required('Le nom est requis.')
    .max(255, 'Le nom ne peut pas dépasser 255 caractères.'),

  description: yup
    .string()
    .nullable()
    .max(2000, 'La description ne peut pas dépasser 2000 caractères.'),

  spotify: yup
    .string()
    .nullable()
    .url('Lien Spotify invalide.')
    .max(2048, 'L’URL est trop longue.'),

  website: yup
    .string()
    .nullable()
    .url('Lien du site invalide.')
    .max(2048, 'L’URL est trop longue.'),

  address: yup.string().nullable().max(255, 'L’adresse ne peut pas dépasser 255 caractères.'),

  city: yup.string().nullable().max(255, 'La ville ne peut pas dépasser 255 caractères.'),

  capacity: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : Number(value)))
    .min(0, 'La capacité ne peut pas être négative.'),
});
