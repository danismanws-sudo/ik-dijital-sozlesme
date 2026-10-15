// components/Wizard.tsx
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import ProgressBar from "./ProgressBar";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import LoadingOverlay from "./LoadingOverlay";
import { encodeUpload } from "../lib/upload";
import { step1Schema, step2Schema, step3Schema, step4Schema } from "../lib/validationSchema";

const steps = [
  { id: 1, component: Step1, label: "Temel Kimlik Bilgileri", fields: Object.keys(step1Schema.fields) },
  { id: 2, component: Step2, label: "Operasyon & Finans", fields: Object.keys(step2Schema.fields) },
  { id: 3, component: Step3, label: "Evrak Yükleme", fields: Object.keys(step3Schema.fields) },
  { id: 4, component: Step4, label: "Sözleşme & İmza", fields: Object.keys(step4Schema.fields) },
];

export default function Wizard() {
  const [current, setCurrent] = useState(0);
  const { handleSubmit, trigger } = useFormContext();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  const onNext = async () => {
    const valid = await trigger(steps[current].fields);
    if (valid) setCurrent((c) => Math.min(c + 1, steps.length - 1));
  };

  const onPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const onSubmit = async (data: any) => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const { idFront, idBack, criminalRecord, ...values } = data;
      const files = {
        idFront: await encodeUpload(idFront, "Kimlik ön yüzü"),
        idBack: await encodeUpload(idBack, "Kimlik arka yüzü"),
        criminalRecord: await encodeUpload(criminalRecord, "Adli sicil kaydı"),
      };
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values, files }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 413
            ? "Yüklenen dosyalar çok büyük. Lütfen daha küçük dosyalar seçin."
            : result.error || "Sunucuya ulaşılamadı. Lütfen tekrar deneyin."
        );
      }
      setDone(true);
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xl shadow-primary/10 ring-1 ring-slate-100 sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white">
          ✓
        </div>
        <h2 className="mt-5 text-xl font-bold text-primary">Sözleşmeniz alındı</h2>
        <p className="mt-2 text-slate-600">
          Bilgileriniz ve imzalı sözleşmeniz İnsan Kaynakları birimine iletildi. Bu sayfayı kapatabilirsiniz.
        </p>
      </div>
    );
  }

  const CurrentStep = steps[current].component;

  return (
    <div className="relative rounded-3xl bg-white p-5 shadow-xl shadow-primary/10 ring-1 ring-slate-100 sm:p-8">
      <ProgressBar steps={steps} active={current} />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <h2 className="mb-5 flex items-center gap-3 text-lg font-bold text-primary">
          <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-primary to-accent" />
          {steps[current].label}
        </h2>
        <CurrentStep />
        {submitError && (
          <p className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-accent">
            {submitError}
          </p>
        )}
        <div className="flex justify-between mt-8">
          {current > 0 && (
            <button type="button" onClick={onPrev} className="btn-secondary">
              Geri
            </button>
          )}
          {current < steps.length - 1 && (
            <button type="button" onClick={onNext} className="btn-primary ml-auto">
              İleri
            </button>
          )}
          {current === steps.length - 1 && (
            <button type="submit" disabled={submitting} className="btn-primary ml-auto">
              Sözleşmeyi Onayla ve Gönder
            </button>
          )}
        </div>
      </form>
      {submitting && <LoadingOverlay />}
    </div>
  );
}
