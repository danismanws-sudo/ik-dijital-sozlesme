import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step2() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid gap-4">
      {/* Medeni Hal */}
      <label className="block">
        <span className="text-sm font-medium">Medeni Hal</span>
        <input
          {...register('maritalStatus')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.maritalStatus && (
          <p className="text-red-600 text-sm">
            {errors.maritalStatus?.message as string}
          </p>
        )}
      </label>

      {/* Kan Grubu */}
      <label className="block">
        <span className="text-sm font-medium">Kan Grubu</span>
        <input
          {...register('bloodType')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.bloodType && (
          <p className="text-red-600 text-sm">
            {errors.bloodType?.message as string}
          </p>
        )}
      </label>

      {/* Tam Adres */}
      <label className="block">
        <span className="text-sm font-medium">Tam Adres</span>
        <input
          {...register('fullAddress')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.fullAddress && (
          <p className="text-red-600 text-sm">
            {errors.fullAddress?.message as string}
          </p>
        )}
      </label>

      {/* Acil Durum Kişisi - Ad Soyad */}
      <label className="block">
        <span className="text-sm font-medium">Acil Durum Kişisi (Ad Soyad)</span>
        <input
          {...register('emergencyContactName')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.emergencyContactName && (
          <p className="text-red-600 text-sm">
            {errors.emergencyContactName?.message as string}
          </p>
        )}
      </label>

      {/* Acil Durum Kişisi - Telefon */}
      <label className="block">
        <span className="text-sm font-medium">Acil Durum Kişisi (Telefon)</span>
        <input
          {...register('emergencyContactPhone')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.emergencyContactPhone && (
          <p className="text-red-600 text-sm">
            {errors.emergencyContactPhone?.message as string}
          </p>
        )}
      </label>

      {/* IBAN */}
      <label className="block">
        <span className="text-sm font-medium">IBAN</span>
        <input
          {...register('iban')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.iban && (
          <p className="text-red-600 text-sm">
            {errors.iban?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
