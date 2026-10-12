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
    <div className="grid gap-4">
      <label className="block">
        <span className="text-sm font-medium">Proje Adı</span>
        <input
          {...register("projectName")}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.projectName && (
          <p className="text-red-600 text-sm">{errors.projectName.message}</p>
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
                className="mt-1 block w-full rounded border-gray-300"
              />
            )}
          />
          {errors.startDate && (
            <p className="text-red-600 text-sm">{errors.startDate.message}</p>
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
                className="mt-1 block w-full rounded border-gray-300"
              />
            )}
          />
          {errors.endDate && (
            <p className="text-red-600 text-sm">{errors.endDate.message}</p>
          )}
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">İsim Soyisim</span>
        <input
          {...register("fullName")}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.fullName && (
          <p className="text-red-600 text-sm">{errors.fullName.message}</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">TC Kimlik No</span>
        <input
          {...register("tcNo")}
          maxLength={11}
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.tcNo && (
          <p className="text-red-600 text-sm">{errors.tcNo.message}</p>
        )}
      </label>

      <label className="block">
        <span className="text-sm font-medium">Cep Telefonu</span>
        <input
          {...register("phone")}
          placeholder="05XX XXX XX XX"
          className="mt-1 block w-full rounded border-gray-300"
        />
        {errors.phone && (
          <p className="text-red-600 text-sm">{errors.phone.message}</p>
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
              className="mt-1 block w-full rounded border-gray-300"
            />
          )}
        />
        {errors.birthDate && (
          <p className="text-red-600 text-sm">{errors.birthDate.message}</p>
        )}
      </label>
    </div>
  );
}
