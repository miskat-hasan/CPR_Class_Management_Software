"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-black text-center px-4">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>

      <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>

      <p className="mt-2 text-gray-600 dark:text-gray">
        Sorry, the page you are looking for does not exist or you do not have
        permission to view this page.
      </p>

      <Button
        onClick={() => router.back()}
        className="mt-6 rounded-lg bg-gray px-6 py-3 text-white hover:bg-gray-800 transition cursor-pointer flex items-center gap-2"
      >
        <ArrowLeftIcon size={20}/> Go Back
      </Button>
    </div>
  );
}
