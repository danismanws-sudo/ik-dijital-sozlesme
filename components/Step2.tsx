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
        hint="TR sabittir; ardından boşluk bırakmadan 24 rakam giriniz"
        error={errors.iban}
      >
        <div className="field-group">
          <span className="field-addon font-mono">TR</span>
          <input
            {...register('iban')}
            inputMode="numeric"
            maxLength={24}
            placeholder="000000000000000000000000"
            onInput={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
            }}
            className="field-input mt-0 rounded-l-none font-mono tracking-wide"
          />
        </div>
      </Field>
    </div>
  );
}
