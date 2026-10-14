import { Controller, useFormContext } from 'react-hook-form';
import DatePicker, { registerLocale } from 'react-datepicker';
import { tr } from 'date-fns/locale';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import Field from './Field';
import { DATE_FORMAT, parseDate } from '../lib/date';

registerLocale('tr', tr);

type DateFieldProps = {
  name: string;
  label: string;
  required?: boolean;
  maxDate?: Date;
  /** Month/year dropdowns, handy for birth dates. */
  withDropdowns?: boolean;
};

export default function DateField({ name, label, required, maxDate, withDropdowns }: DateFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Field label={label} required={required} error={errors[name]}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            selected={parseDate(field.value)}
            onChange={(date: Date | null) => field.onChange(date ? format(date, DATE_FORMAT) : '')}
            onBlur={field.onBlur}
            dateFormat={DATE_FORMAT}
            locale="tr"
            placeholderText="GG.AA.YYYY"
            maxDate={maxDate}
            showMonthDropdown={withDropdowns}
            showYearDropdown={withDropdowns}
            dropdownMode="select"
            className="field-input"
          />
        )}
      />
    </Field>
  );
}
