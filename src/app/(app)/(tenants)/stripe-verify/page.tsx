"use client";

import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useEffect } from "react";
import { LoaderIcon } from "lucide-react";

const StripeVerifyPage = () => {
  const trpc = useTRPC();
  // immediately verify
  const { mutate: verify } = useMutation(trpc.checkout.verify.mutationOptions({
    // take user to data.url on success, otherwise take the user to the root page on error
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      window.location.href = "/";
    },
  }));
  useEffect(() => {
    verify();
  }, [verify]);
  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </main>
  );
};

export default StripeVerifyPage;
