// components/Step1.tsx
import { useFormContext } from "react-hook-form";
import Field from "./Field";
import DateField from "./DateField";

const digitsOnly = (e: React.FormEvent<HTMLInputElement>) => {
  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
};

export default function Step1() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="step-card">
      <DateField name="hireDate" label="İşe Giriş Tarihi" required />

      <Field label="İsim Soyisim" required error={errors.fullName}>
        <input {...register("fullName")} className="field-input" />
      </Field>

      <Field
        label="TC Kimlik Numarası"
        required
        hint="Sadece rakamlarla tam 11 haneli olarak giriniz"
        error={errors.tcNo}
      >
        <input
          {...register("tcNo")}
          inputMode="numeric"
          maxLength={11}
          onInput={digitsOnly}
          className="field-input"
        />
      </Field>

      <Field label="Telefon Numarası" required error={errors.phone}>
        <div className="field-group">
          <span className="field-addon">+90</span>
          <input
            {...register("phone")}
            type="tel"
            inputMode="numeric"
            maxLength={10}
            onInput={digitsOnly}
            placeholder="5XXXXXXXXX"
            className="field-input mt-0 rounded-l-none"
          />
        </div>
      </Field>

      <DateField name="birthDate" label="Doğum Tarihi" required maxDate={new Date()} withDropdowns />
    </div>
  );
}
