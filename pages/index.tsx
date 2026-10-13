// pages/index.tsx
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Wizard from "../components/Wizard";
import { step1Schema, step2Schema, step3Schema, step4Schema } from "../lib/validationSchema";

export type FormValues = {
  // Step 1
  projectName: string;
  startDate: string;
  endDate: string;
  fullName: string;
  tcNo: string;
  phone: string;
  birthDate: string;
  // Step 2
  maritalStatus: string;
  bloodType: string;
  fullAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  iban: string;
  // Step 3
  criminalRecord?: string;
  idFront?: string;
  idBack?: string;
  // Step 4
  contractAccepted: boolean;
  infoConfirmed: boolean;
  signature?: string;
};

const combinedSchema = step1Schema
  .concat(step2Schema)
  .concat(step3Schema)
  .concat(step4Schema);

export default function Home() {
  const methods = useForm<FormValues>({
    resolver: yupResolver(combinedSchema),
    mode: "onBlur",
    defaultValues: {
    contractAccepted: false,
    infoConfirmed: false,
  },
  });

  return (
    <FormProvider {...methods}>
      <header className="bg-gradient-to-br from-primary via-indigo-600 to-accent px-4 pb-28 pt-10 text-center text-white">
        <div className="mx-auto inline-block rounded-2xl bg-white px-4 shadow-xl">
          <img src="/LOGO/LOGO%202.jpg" alt="Detay Stok Sayım" className="h-24 w-auto" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">Dijital Sözleşme Formu</h1>
        <p className="mt-2 text-sm text-white/80 sm:text-base">Bilgilerinizi 4 adımda doldurup sözleşmenizi imzalayın.</p>
      </header>
      <main className="mx-auto -mt-20 max-w-2xl px-4 pb-12">
        <Wizard />
      </main>
    </FormProvider>
  );
}
