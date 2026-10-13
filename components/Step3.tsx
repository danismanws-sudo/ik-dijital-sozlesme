import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step3() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="step-card">
      {/* Kimlik Ön Yüzü */}
      <label className="block">
        <span className="field-label">Kimlik Ön Yüzü</span>
        <input
          type="file"
          {...register('idFront')}
          className="field-input"
        />
        {errors.idFront && (
          <p className="field-error">
            {errors.idFront?.message as string}
          </p>
        )}
      </label>

      {/* Kimlik Arka Yüzü */}
      <label className="block">
        <span className="field-label">Kimlik Arka Yüzü</span>
        <input
          type="file"
          {...register('idBack')}
          className="field-input"
        />
        {errors.idBack && (
          <p className="field-error">
            {errors.idBack?.message as string}
          </p>
        )}
      </label>

      {/* Vesikalık Fotoğraf */}
      <label className="block">
        <span className="field-label">Vesikalık Fotoğraf</span>
        <input
          type="file"
          {...register('passportPhoto')}
          className="field-input"
        />
        {errors.passportPhoto && (
          <p className="field-error">
            {errors.passportPhoto?.message as string}
          </p>
        )}
      </label>

      {/* Adli Sicil Kaydı */}
      <label className="block">
        <span className="field-label">Adli Sicil Kaydı</span>
        <input
          type="file"
          {...register('criminalRecord')}
          className="field-input"
        />
        {errors.criminalRecord && (
          <p className="field-error">
            {errors.criminalRecord?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
