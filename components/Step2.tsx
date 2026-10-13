import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step2() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="step-card">
      {/* Medeni Hal */}
      <label className="block">
        <span className="field-label">Medeni Hal</span>
        <input
          {...register('maritalStatus')}
          className="field-input"
        />
        {errors.maritalStatus && (
          <p className="field-error">
            {errors.maritalStatus?.message as string}
          </p>
        )}
      </label>

      {/* Kan Grubu */}
      <label className="block">
        <span className="field-label">Kan Grubu</span>
        <input
          {...register('bloodType')}
          className="field-input"
        />
        {errors.bloodType && (
          <p className="field-error">
            {errors.bloodType?.message as string}
          </p>
        )}
      </label>

      {/* Tam Adres */}
      <label className="block">
        <span className="field-label">Tam Adres</span>
        <input
          {...register('fullAddress')}
          className="field-input"
        />
        {errors.fullAddress && (
          <p className="field-error">
            {errors.fullAddress?.message as string}
          </p>
        )}
      </label>

      {/* Acil Durum Kişisi - Ad Soyad */}
      <label className="block">
        <span className="field-label">Acil Durum Kişisi (Ad Soyad)</span>
        <input
          {...register('emergencyContactName')}
          className="field-input"
        />
        {errors.emergencyContactName && (
          <p className="field-error">
            {errors.emergencyContactName?.message as string}
          </p>
        )}
      </label>

      {/* Acil Durum Kişisi - Telefon */}
      <label className="block">
        <span className="field-label">Acil Durum Kişisi (Telefon)</span>
        <input
          {...register('emergencyContactPhone')}
          className="field-input"
        />
        {errors.emergencyContactPhone && (
          <p className="field-error">
            {errors.emergencyContactPhone?.message as string}
          </p>
        )}
      </label>

      {/* IBAN */}
      <label className="block">
        <span className="field-label">IBAN</span>
        <input
          {...register('iban')}
          className="field-input"
        />
        {errors.iban && (
          <p className="field-error">
            {errors.iban?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
