import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import Field from './Field';
import DateField from './DateField';

const CONTRACT_URL = '/belgeler/proje-bazli-is-sozlesmesi.pdf';

export default function Step4() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  // The contract checkbox stays locked until the PDF has been opened.
  const [contractOpened, setContractOpened] = useState<boolean>(!!getValues('contractAccepted'));
  const signatureRef = useRef<any>(null);

  useEffect(() => {
    const saved = getValues('signature');
    if (saved) signatureRef.current?.fromDataURL(saved);
  }, [getValues]);

  const saveSignature = () => {
    const pad = signatureRef.current;
    setValue('signature', pad.isEmpty() ? '' : pad.toDataURL('image/png'), { shouldValidate: true });
  };

  const clearSignature = () => {
    signatureRef.current.clear();
    setValue('signature', '', { shouldValidate: true });
  };

  return (
    <div className="step-card">
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
        <p className="text-sm text-slate-600">Lütfen onaylamadan önce sözleşmeyi açıp okuyunuz:</p>
        <a
          href={CONTRACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setContractOpened(true)}
          className="mt-1 inline-block font-bold text-primary underline underline-offset-4 hover:text-accent"
        >
          PROJE BAZLI İŞ SÖZLEŞMESİ
        </a>
      </div>

      <label className={`check-row items-start ${contractOpened ? '' : 'cursor-not-allowed opacity-60'}`}>
        <span className="flex-1 text-sm leading-relaxed">
          Yukarıdaki sözleşme maddelerini okudum. İşin proje bitimiyle sona ereceğini, sigortamın çalıştığım gün
          kadar yatacağını, eksik/sahte belge beyanına ilişkin sonuçları ve &quot;%70 Kesinti dahil tüm Cezai
          Şart&quot; maddelerini anladım, hür irademle kabul ediyorum.
        </span>
        <input
          type="checkbox"
          {...register('contractAccepted')}
          disabled={!contractOpened}
          className="check-box mt-0.5"
        />
        {!contractOpened && (
          <p className="field-hint basis-full">Onay kutusunu işaretleyebilmek için önce sözleşmeyi açınız.</p>
        )}
        {errors.contractAccepted && (
          <p className="field-error">{errors.contractAccepted?.message as string}</p>
        )}
      </label>

      <h3 className="section-title">GÖREV VE TARİH BİLGİLERİ</h3>

      <Field label="Çalışılacak Proje / Mağaza Adı" required error={errors.projectName}>
        <input {...register('projectName')} className="field-input" />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <DateField name="startDate" label="İş Başlangıç Tarihi" required />
        <DateField name="endDate" label="İş Bitiş Tarihi" required />
      </div>

      <label className="check-row items-start">
        <span className="flex-1 text-sm leading-relaxed">
          Doldurulan belge ve dokümanların doğru olduğunu beyan eder, yanlış ve art niyetli bilgi paylaşımında hatanın
          tarafımdan kaynaklandığını belirtmek isterim. Aldatıcı bilgilerin girilmesi sonucunda Detay Envanter ve Stok
          Sayım firmasının gerekli tüm yasal haklarını arayarak işlemleri başlatacağını kabul ve beyan ederim.
        </span>
        <input type="checkbox" {...register('infoConfirmed')} className="check-box mt-0.5" />
        {errors.infoConfirmed && <p className="field-error">{errors.infoConfirmed?.message as string}</p>}
      </label>

      <div>
        <span className="field-label">
          İmzanız <span className="font-normal text-slate-500">(Lütfen aşağıdaki alana imzanızı çiziniz)</span>
          <span className="text-accent"> *</span>
        </span>
        <div className="relative mt-1.5 h-48 overflow-hidden rounded-xl border-2 border-dashed border-indigo-200 bg-slate-50">
          <SignatureCanvas
            ref={signatureRef}
            onEnd={saveSignature}
            penColor="#1b2d73"
            canvasProps={{ className: 'h-full w-full touch-none' }}
          />
          <button
            type="button"
            onClick={clearSignature}
            className="absolute right-2 top-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-accent shadow hover:bg-rose-50"
          >
            Temizle
          </button>
        </div>
        {errors.signature && <p className="field-error">{errors.signature?.message as string}</p>}
      </div>
    </div>
  );
}
