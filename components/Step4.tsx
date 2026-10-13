import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step4() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="step-card">
      {/* Sözleşme Onay (checkbox) */}
      <label className="check-row">
        <span className="field-label">Sözleşme Onay</span>
        <input
          type="checkbox"
          {...register('contractAccepted')}
          className="check-box"
        />
        {errors.contractAccepted && (
          <p className="field-error">
            {errors.contractAccepted?.message as string}
          </p>
        )}
      </label>

      {/* KVKK Onay (checkbox) */}
      <label className="check-row">
        <span className="field-label">KVKK Onay</span>
        <input
          type="checkbox"
          {...register('infoConfirmed')}
          className="check-box"
        />
        {errors.infoConfirmed && (
          <p className="field-error">
            {errors.infoConfirmed?.message as string}
          </p>
        )}
      </label>

      {/* Dijital İmza (text) */}
      <label className="block">
        <span className="field-label">Dijital İmza (Ad Soyad)</span>
        <input
          {...register('signature')}
          className="field-input"
        />
        {errors.signature && (
          <p className="field-error">
            {errors.signature?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
