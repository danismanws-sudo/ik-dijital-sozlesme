// components/Wizard.tsx
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import ProgressBar from "./ProgressBar";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import LoadingOverlay from "./LoadingOverlay";

const steps = [
  { id: 1, component: Step1, label: "Proje & Kimlik" },
  { id: 2, component: Step2, label: "Operasyon & Finans" },
  { id: 3, component: Step3, label: "Evrak Yükleme" },
  { id: 4, component: Step4, label: "Sözleşme & İmza" },
];

export default function Wizard() {
  const [current, setCurrent] = useState(0);
  const { handleSubmit, trigger } = useFormContext();
  const [submitting, setSubmitting] = useState(false);

  const onNext = async () => {
    const valid = await trigger();
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
    <div className="relative p-6 bg-white rounded-lg shadow">
      <ProgressBar steps={steps} active={current} />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <CurrentStep />
        <div className="flex justify-between mt-8">
          {current > 0 && (
            <button type="button" onClick={onPrev} className="px-4 py-2 bg-gray-200 text-primary rounded">
              Geri
            </button>
          )}
          {current < steps.length - 1 && (
            <button type="button" onClick={onNext} className="ml-auto px-4 py-2 bg-accent text-white rounded">
              İleri
            </button>
          )}
          {current === steps.length - 1 && (
            <button type="submit" disabled={submitting} className="ml-auto px-4 py-2 bg-accent text-white rounded disabled:opacity-50">
              Gönder
            </button>
          )}
        </div>
      </form>
      {submitting && <LoadingOverlay />}
    </div>
  );
}
