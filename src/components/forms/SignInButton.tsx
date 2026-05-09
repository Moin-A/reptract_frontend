"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/forms/auth_dialog";

function SearchParamsHandler({ setIsOpen }: { setIsOpen: (v: boolean) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    setIsOpen(params.get("verified") === "true");
  }, [params, setIsOpen]);
  return null;
}

export function SignInButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler setIsOpen={setIsOpen} />
      </Suspense>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        Sign in
      </Button>
      <AuthDialog isOpen={isOpen} onOpenChange={() => setIsOpen(!isOpen)} />
    </>
  );
}
