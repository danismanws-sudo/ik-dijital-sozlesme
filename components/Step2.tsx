import React from 'react';
import { useFormContext } from 'react-hook-form';
import Field from './Field';

export default function Step2() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="step-card">
      <Field label="Sorumlu Yönetici" required error={errors.managerName}>
        <input {...register('managerName')} className="field-input" />
      </Field>

      <Field label="Durumu" required error={errors.status}>
        <select {...register('status')} className="field-input">
          <option value="" disabled>
            Seçiniz
          </option>
          <option value="Aktif">Aktif</option>
          <option value="Pasif">Pasif</option>
        </select>
      </Field>

      <Field label="Oturduğu Semt" required error={errors.district}>
        <input {...register('district')} className="field-input" />
      </Field>

      <Field
        label="IBAN Bilgisi (Başında TR ile 26 Karakter)"
        required
        hint="TR dahil, hiç boşluk bırakmadan tam 26 hane olacak şekilde giriniz"
        error={errors.iban}
      >
        <input
          {...register('iban')}
          maxLength={26}
          placeholder="TR000000000000000000000000"
          onInput={(e) => {
            e.currentTarget.value = e.currentTarget.value.toUpperCase().replace(/\s/g, '');
          }}
          className="field-input font-mono tracking-wide"
        />
      </Field>
    </div>
  );
}
