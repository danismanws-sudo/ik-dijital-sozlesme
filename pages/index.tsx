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
      status: "Aktif",
      contractAccepted: false,
      infoConfirmed: false,
    },
  });

  return (
    <FormProvider {...methods}>
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Wizard />
      </main>
    </FormProvider>
  );
}
