import React from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Placeholder Step2 component.
 * Add real fields as needed. Currently includes a single example field
 * with proper error handling (type‑cast to string) to avoid FieldError issues.
 */
export default function Step2() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="text-sm font-medium">Örnek Alan 2</span>
        <input
          {...register('exampleField2')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.exampleField2 && (
          <p className="text-red-600 text-sm">
            {errors.exampleField2?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
