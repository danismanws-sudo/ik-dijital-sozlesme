import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Step3() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid gap-4">
      {/* Kimlik Ön Yüzü */}
      <label className="block">
        <span className="text-sm font-medium">Kimlik Ön Yüzü</span>
        <input
          type="file"
          {...register('idFront')}
          className="mt-1 block w-full"
        />
        {errors.idFront && (
          <p className="text-red-600 text-sm">
            {errors.idFront?.message as string}
          </p>
        )}
      </label>

      {/* Kimlik Arka Yüzü */}
      <label className="block">
        <span className="text-sm font-medium">Kimlik Arka Yüzü</span>
        <input
          type="file"
          {...register('idBack')}
          className="mt-1 block w-full"
        />
        {errors.idBack && (
          <p className="text-red-600 text-sm">
            {errors.idBack?.message as string}
          </p>
        )}
      </label>

      {/* Vesikalık Fotoğraf */}
      <label className="block">
        <span className="text-sm font-medium">Vesikalık Fotoğraf</span>
        <input
          type="file"
          {...register('passportPhoto')}
          className="mt-1 block w-full"
        />
        {errors.passportPhoto && (
          <p className="text-red-600 text-sm">
            {errors.passportPhoto?.message as string}
          </p>
        )}
      </label>

      {/* Adli Sicil Kaydı */}
      <label className="block">
        <span className="text-sm font-medium">Adli Sicil Kaydı</span>
        <input
          type="file"
          {...register('criminalRecord')}
          className="mt-1 block w-full"
        />
        {errors.criminalRecord && (
          <p className="text-red-600 text-sm">
            {errors.criminalRecord?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
