import * as yup from 'yup';
import { parseDate } from './date';

const requiredDate = (message: string) =>
  yup
    .string()
    .required(message)
    .test('date', 'Geçerli bir tarih giriniz (GG.AA.YYYY)', (value) => !value || !!parseDate(value));

const requiredFile = (message: string) =>
  yup.mixed().test('required', message, (value: any) => !!value && value.length > 0);

/**
 * Validation schema for Step 1 – basic identity information.
 */
export const step1Schema = yup.object({
  hireDate: requiredDate('İşe giriş tarihi zorunlu'),
  fullName: yup.string().trim().required('İsim Soyisim zorunlu'),
  tcNo: yup
    .string()
    .required('TC kimlik no zorunlu')
    .matches(/^\d{11}$/, 'TC kimlik no 11 rakam olmalı'),
  phone: yup
    .string()
    .required('Telefon zorunlu')
    .matches(/^5\d{9}$/, 'Telefon 5 ile başlayan 10 haneli olmalı (ör. 5321112233)'),
  birthDate: requiredDate('Doğum tarihi zorunlu'),
});

/**
 * Validation schema for Step 2 – operation & finance fields.
 */
export const step2Schema = yup.object({
  managerName: yup.string().trim().required('Sorumlu yönetici zorunlu'),
  status: yup.string().oneOf(['Aktif', 'Pasif'], 'Durum seçiniz').required('Durum seçiniz'),
  district: yup.string().trim().required('Oturduğu semt zorunlu'),
  // The input holds only the 24 digits; "TR" is a fixed prefix added here,
  // so the submitted value is the full 26-character IBAN.
  iban: yup
    .string()
    .transform((value) => (value ? `TR${value}` : value))
    .required('IBAN zorunlu')
    .matches(/^TR\d{24}$/, "IBAN TR'den sonra 24 rakam olmalı"),
});

/**
 * Validation schema for Step 3 – document uploads.
 */
export const step3Schema = yup.object({
  criminalRecord: requiredFile('Adli sicil kaydı zorunlu'),
  idFront: requiredFile('Kimlik ön yüzü zorunlu'),
  idBack: requiredFile('Kimlik arka yüzü zorunlu'),
});

/**
 * Validation schema for Step 4 – contract, job dates, declaration and signature.
 */
export const step4Schema = yup.object({
  contractAccepted: yup.boolean().oneOf([true], 'Sözleşme kabul edilmelidir').required(),
  projectName: yup.string().trim().required('Proje / mağaza adı zorunlu'),
  startDate: requiredDate('İş başlangıç tarihi zorunlu'),
  endDate: requiredDate('İş bitiş tarihi zorunlu').test(
    'after-start',
    'Bitiş tarihi başlangıç tarihinden önce olamaz',
    function (value) {
      const start = parseDate(this.parent.startDate);
      const end = parseDate(value);
      return !start || !end || end >= start;
    }
  ),
  infoConfirmed: yup.boolean().oneOf([true], 'Beyan onayı zorunlu').required(),
  signature: yup.string().required('Lütfen imzanızı çiziniz'),
});
