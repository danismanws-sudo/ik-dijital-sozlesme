import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import SignatureCanvas from 'react-signature-canvas';
import Field from './Field';
import DateField from './DateField';

const CONTRACT_URL = '/belgeler/proje-bazli-is-sozlesmesi.pdf';
const KVKK_URL = '/belgeler/kvkk-aydinlatma-metni.pdf';

type LockedConsentProps = {
  name: string;
  documentUrl: string;
  documentTitle: string;
  intro: string;
  children: React.ReactNode;
};

/** A document link plus a checkbox that stays locked until the document has been opened. */
function LockedConsent({ name, documentUrl, documentTitle, intro, children }: LockedConsentProps) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext();
  const [opened, setOpened] = useState<boolean>(!!getValues(name));

  return (
    <>
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
        <p className="text-sm text-slate-600">{intro}</p>
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpened(true)}
          className="mt-1 inline-block font-bold text-primary underline underline-offset-4 hover:text-accent"
        >
          {documentTitle}
        </a>
      </div>

      <label className={`check-row items-start ${opened ? '' : 'cursor-not-allowed opacity-60'}`}>
        <span className="flex-1 text-sm leading-relaxed">{children}</span>
        <input type="checkbox" {...register(name)} disabled={!opened} className="check-box mt-0.5" />
        {!opened && (
          <p className="field-hint basis-full">Onay kutusunu işaretleyebilmek için önce belgeyi açınız.</p>
        )}
        {errors[name] && <p className="field-error">{errors[name]?.message as string}</p>}
      </label>
    </>
  );
}

export default function Step4() {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
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
      <LockedConsent
        name="contractAccepted"
        documentUrl={CONTRACT_URL}
        documentTitle="PROJE BAZLI İŞ SÖZLEŞMESİ"
        intro="Lütfen onaylamadan önce sözleşmeyi açıp okuyunuz:"
      >
        Yukarıdaki sözleşme maddelerini okudum. İşin proje bitimiyle sona ereceğini, sigortamın çalıştığım gün kadar
        yatacağını, eksik/sahte belge beyanına ilişkin sonuçları ve &quot;%70 Kesinti dahil tüm Cezai Şart&quot;
        maddelerini anladım, hür irademle kabul ediyorum.
      </LockedConsent>

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

      <h3 className="section-title">KİŞİSEL VERİLERİN KORUNMASI (KVKK)</h3>

      <LockedConsent
        name="kvkkAccepted"
        documentUrl={KVKK_URL}
        documentTitle="KVKK AYDINLATMA METNİ VE AÇIK RIZA BEYANI"
        intro="Lütfen onaylamadan önce aydınlatma metnini açıp okuyunuz:"
      >
        KVKK Aydınlatma Metni&apos;ni okudum ve anladım. Adli sicil kaydım dahil kişisel verilerimin belirtilen amaçlarla
        işlenmesine ve yurt dışında bulunan bulut depolama hizmetinde saklanmasına açık rıza veriyorum.
      </LockedConsent>

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
