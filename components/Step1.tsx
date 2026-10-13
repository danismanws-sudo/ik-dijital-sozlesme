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
    <div className="bg-slate-50 p-6 rounded-xl shadow-lg grid gap-4">
      <label className="block">
        <span className="text-sm font-medium">Proje Adı</span>
        <input
          {...register("projectName")}
          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm"
        />
        {errors.projectName && (
          <p className="text-red-600 text-sm">{errors.projectName.message as string}</p>
        )}
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium">Başlangıç Tarihi</span>
          <Controller
            control={control}
            name="startDate"
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString())}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm"
              />
            )}
          />
          {errors.startDate && (
            <p className="text-red-600 text-sm">{errors.startDate.message as string}</p>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-medium">Bitiş Tarihi</span>
          <Controller
            control={control}
            name="endDate"
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value ? new Date(field.value) : null}
                onChange={(date) => field.onChange(date?.toISOString())}
                dateFormat="yyyy-MM-dd"
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm"
              />
            )}
          />
          {errors.endDate && (
            <p className="text-red-600 text-sm">{errors.endDate.message as string}</p>
          )}
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">İsim Soyisim</span>
        <input
          {...register("fullName")}
          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm"
        />
        {errors.fullName && (
          <p className="text-red-600 text-sm">{errors.fullName?.message as string}</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">TC Kimlik No</span>
        <input
          {...register("tcNo")}
          maxLength={11}
          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm"
        />
        {errors.tcNo && (
          <p className="text-red-600 text-sm">{errors.tcNo.message as string}</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">Cep Telefonu</span>
        <input
          {...register("phone")}
          placeholder="05XX XXX XX XX"
          className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm"
        />
        {errors.phone && (
          <p className="text-red-600 text-sm">{errors.phone.message as string}</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">Doğum Tarihi</span>
        <Controller
          control={control}
          name="birthDate"
          render={({ field }) => (
            <DatePicker
              {...field}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date) => field.onChange(date?.toISOString())}
              dateFormat="yyyy-MM-dd"
              className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm"
            />
          )}
        />
        {errors.birthDate && (
          <p className="text-red-600 text-sm">{errors.birthDate?.message as string}</p>
        )}
      </label>
    </div>
  );
}
