import { useToast } from "@/components/ui/use-toast";
import { errorToString } from "@/lib/converters";

/**
 * Hook to handle errors.
 */
export default function useError() {
  const { toast } = useToast();

  let handleError = function (error: Error, displayToast?: boolean) {
    console.error(error);
    if (displayToast) {
      toast({
        variant: "destructive",
        title: "Something went wrong :(",
        description: errorToString(error),
      });
    }
  };

  return {
    handleError,
  };
}
