import * as yup from 'yup';

/**
 * Validation schema for Step 1 – basic project and personal information.
 */
export const step1Schema = yup.object({
  projectName: yup.string().required('Proje adı zorunlu'),
  startDate: yup.date().required('Başlangıç tarihi zorunlu'),
  endDate: yup.date().required('Bitiş tarihi zorunlu'),
  fullName: yup.string().required('İsim Soyisim zorunlu'),
  tcNo: yup
    .string()
    .required('TC kimlik no zorunlu')
    .matches(/^\d{11}$/, 'TC kimlik no 11 rakam olmalı'),
  phone: yup.string().required('Telefon zorunlu'),
  birthDate: yup.date().required('Doğum tarihi zorunlu'),
});

/**
 * Validation schema for Step 2 – operation & finance fields.
 * Only the fields that exist in the current UI are required; the rest are optional
 * (they will be filled in later steps of the wizard).
 */
export const step2Schema = yup.object({
  maritalStatus: yup.string().required('Medeni hal zorunlu'),
  bloodType: yup.string().required('Kan grubu zorunlu'),
  fullAddress: yup.string().required('Tam adres zorunlu'),
  emergencyContactName: yup.string().required('Acil durum kişi adı zorunlu'),
  emergencyContactPhone: yup.string().required('Acil durum kişi telefonu zorunlu'),
  iban: yup.string().required('IBAN zorunlu'),
});

/**
 * Validation schema for Step 3 – optional documentation uploads.
 */
const requiredFile = (message: string) =>
  yup.mixed().test('required', message, (value: any) => !!value && value.length > 0);

export const step3Schema = yup.object({
  criminalRecord: requiredFile('Adli sicil kaydı zorunlu'),
  idFront: requiredFile('Kimlik ön yüzü zorunlu'),
  idBack: requiredFile('Kimlik arka yüzü zorunlu'),
  passportPhoto: requiredFile('Vesikalık fotoğraf zorunlu'),
});

/**
 * Validation schema for Step 4 – final confirmation and signature.
 */
export const step4Schema = yup.object({
  contractAccepted: yup.boolean().oneOf([true], 'Sözleşme kabul edilmelidir').required(),
  infoConfirmed: yup.boolean().oneOf([true], 'KVKK onayı zorunlu').required(),
  signature: yup.string().required('İmza zorunlu'),
});
