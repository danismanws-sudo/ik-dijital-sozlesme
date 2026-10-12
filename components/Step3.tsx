import React from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Placeholder Step3 component.
 * Add real fields as needed. Includes proper error handling with cast to string.
 */
export default function Step3() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="text-sm font-medium">Örnek Alan 3</span>
        <input
          {...register('exampleField3')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.exampleField3 && (
          <p className="text-red-600 text-sm">
            {errors.exampleField3?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
