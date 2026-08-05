// src/app/enroll/registration-confirmed/page.js
import RegistrationConfirmedContent from "@/components/enrollment/RegistrationConfirmedContent";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RegistrationConfirmedContent />
    </Suspense>
  );
}
