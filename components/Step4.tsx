import React from 'react';
import { useFormContext } from 'react-hook-form';

/**
 * Placeholder Step4 component.
 * Add real form fields as needed. Includes proper error handling with
 * optional chaining and string cast to avoid FieldError type issues.
 */
export default function Step4() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="text-sm font-medium">Örnek Alan 4</span>
        <input
          {...register('exampleField4')}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.exampleField4 && (
          <p className="text-red-600 text-sm">
            {errors.exampleField4?.message as string}
          </p>
        )}
      </label>
    </div>
  );
}
