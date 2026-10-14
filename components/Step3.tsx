import React from 'react';
import { useFormContext } from 'react-hook-form';
import Field from './Field';

export default function Step3() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="step-card">
      <Field label="Kimlik Ön Yüzü" required error={errors.idFront}>
        <input type="file" {...register('idFront')} className="field-input" />
      </Field>

      <Field label="Kimlik Arka Yüzü" required error={errors.idBack}>
        <input type="file" {...register('idBack')} className="field-input" />
      </Field>

      <Field label="Adli Sicil Kaydı" required error={errors.criminalRecord}>
        <input type="file" {...register('criminalRecord')} className="field-input" />
      </Field>
    </div>
  );
}
