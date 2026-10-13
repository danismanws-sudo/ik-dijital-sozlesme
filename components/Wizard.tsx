// components/Wizard.tsx
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import ProgressBar from "./ProgressBar";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import LoadingOverlay from "./LoadingOverlay";
import { step1Schema, step2Schema, step3Schema, step4Schema } from "../lib/validationSchema";

const steps = [
  { id: 1, component: Step1, label: "Proje & Kimlik", fields: Object.keys(step1Schema.fields) },
  { id: 2, component: Step2, label: "Operasyon & Finans", fields: Object.keys(step2Schema.fields) },
  { id: 3, component: Step3, label: "Evrak Yükleme", fields: Object.keys(step3Schema.fields) },
  { id: 4, component: Step4, label: "Sözleşme & İmza", fields: Object.keys(step4Schema.fields) },
];

export default function Wizard() {
  const [current, setCurrent] = useState(0);
  const { handleSubmit, trigger } = useFormContext();
  const [submitting, setSubmitting] = useState(false);

  const onNext = async () => {
    const valid = await trigger(steps[current].fields);
    if (valid) setCurrent((c) => Math.min(c + 1, steps.length - 1));
  };

  const onPrev = () => setCurrent((c) => Math.max(c - 1, 0));

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const WEB_APP_URL = "https://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@github.com/danismanws-sudo/ik-dijital-sozlesme.git";
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Sunucu hatası");
      alert("Form başarıyla gönderildi!");
    } catch (e: any) {
      alert(`Gönderim hatası: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

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
              Gönder
            </button>
          )}
        </div>
      </form>
      {submitting && <LoadingOverlay />}
    </div>
  );
}
