import React from 'react';

type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  error?: any;
  children: React.ReactNode;
};

/** Label + hint + error wrapper shared by all form inputs. */
export default function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      {hint && <span className="field-hint">{hint}</span>}
      {children}
      {error && <p className="field-error">{error.message as string}</p>}
    </label>
  );
}
