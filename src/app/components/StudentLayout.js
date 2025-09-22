'use client';
import React, { useEffect, Suspense } from 'react';
import useAppStore from '../store/useStore';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { StudentNavBar } from './StudentNavBar';
import { encryptRedirectUrl } from '../lib/skillslist';

export const StudentLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();  // ✅ still allowed here
  const isStudentLogined = useAppStore((state) => state.isStudentLogined);

  useEffect(() => {
    if (!isStudentLogined) {
      // ✅ only use searchParams inside effect
      const paramsString = searchParams?.toString();
      const currentUrl = `${pathname}${paramsString ? "?" + paramsString : ""}`;
      const encrypted = encryptRedirectUrl(currentUrl);

      router.push(`/?redirect=${encodeURIComponent(encrypted)}`);
    }
  }, [isStudentLogined, pathname, searchParams, router]);

  // ✅ render nothing until login check completes
  if (!isStudentLogined) {
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <StudentNavBar />
        {children}
      </div>
    </Suspense>
  );
};
