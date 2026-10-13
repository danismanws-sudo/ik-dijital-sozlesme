import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step4() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="bg-slate-50 p-6 rounded-xl shadow-lg grid gap-4">
      {/* Sözleşme Onay (checkbox) */}
      <label className="block">
        <span className="text-sm font-medium">Sözleşme Onay</span>
        <input
          type="checkbox"
          {...register('contractAccepted')}
          className="mt-1"
        />
        {errors.contractAccepted && (
          <p className="text-red-600 text-sm">
            {errors.contractAccepted?.message as string}
          </p>
        )}
      </label>

      {/* KVKK Onay (checkbox) */}
      <label className="block">
        <span className="text-sm font-medium">KVKK Onay</span>
        <input
          type="checkbox"
          {...register('infoConfirmed')}
          className="mt-1"
        />
        {errors.infoConfirmed && (
          <p className="text-red-600 text-sm">
            {errors.infoConfirmed?.message as string}
          </p>
        )}
      </label>

      {/* Dijital İmza (text) */}
      <label className="block">
        <span className="text-sm font-medium">Dijital İmza (Ad Soyad)</span>
        <input
          {...register('signature')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.signature && (
          <p className="text-red-600 text-sm">
            {errors.signature?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
