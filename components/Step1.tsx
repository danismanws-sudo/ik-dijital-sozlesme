// components/Step1.tsx
import { useFormContext, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Step1() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="step-card">
      <label className="block">
        <span className="field-label">Proje Adı</span>
        <input
          {...register("projectName")}
          className="field-input"
        />
        {errors.projectName && (
          <p className="field-error">{errors.projectName.message as string}</p>
        )}
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="field-label">Başlangıç Tarihi</span>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString())}
                dateFormat="yyyy-MM-dd"
                className="field-input"
              />
            )}
          />
          {errors.startDate && (
            <p className="field-error">{errors.startDate.message as string}</p>
          )}
        </label>

        <label className="block">
          <span className="field-label">Bitiş Tarihi</span>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString())}
                dateFormat="yyyy-MM-dd"
                className="field-input"
              />
            )}
          />
          {errors.endDate && (
            <p className="field-error">{errors.endDate.message as string}</p>
          )}
        </label>
      </div>

      <label className="block">
        <span className="field-label">İsim Soyisim</span>
        <input
          {...register("fullName")}
          className="field-input"
        />
        {errors.fullName && (
          <p className="field-error">{errors.fullName?.message as string}</p>
        )}
      </label>

      <label className="block">
        <span className="field-label">TC Kimlik No</span>
        <input
          {...register("tcNo")}
          maxLength={11}
          className="field-input"
        />
        {errors.tcNo && (
          <p className="field-error">{errors.tcNo.message as string}</p>
        )}
      </label>

      <label className="block">
        <span className="field-label">Cep Telefonu</span>
        <input
          {...register("phone")}
          placeholder="05XX XXX XX XX"
          className="field-input"
        />
        {errors.phone && (
          <p className="field-error">{errors.phone.message as string}</p>
        )}
      </label>

      <label className="block">
        <span className="field-label">Doğum Tarihi</span>
        <Controller
          control={control}
          name="birthDate"
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString())}
              dateFormat="yyyy-MM-dd"
              className="field-input"
            />
          )}
        />
        {errors.birthDate && (
          <p className="field-error">{errors.birthDate?.message as string}</p>
        )}
      </label>
    </div>
  );
}
