import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const BackButton = ({ className }) => {
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.back()}
      type="button"
      className={cn(
        "px-6 py-2 bg-transparent border border-gray-300 dark:bg-transparent dark:text-white dark:hover:bg-neutral-300/10 rounded-md text-sm font-medium text-black hover:bg-gray-50",
        className,
      )}
    >
      Back
    </Button>
  );
};

export default BackButton;
