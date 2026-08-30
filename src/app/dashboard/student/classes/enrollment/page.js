"use client";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function Page() {
  const { selectedTrainingSiteId } = useAuth();
  return (
    <div>
      To schedule a new class click{" "}
      <Link
        href={`/schedule?ts_id=${selectedTrainingSiteId ?? 1}`}
        target="_blank"
        className="text-brown"
      >
        here
      </Link>
    </div>
  );
}
