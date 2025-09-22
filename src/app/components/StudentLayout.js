'use client';
import React, { useEffect } from 'react';
import useAppStore from '../store/useStore';
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { StudentNavBar } from './StudentNavBar';
import { encryptRedirectUrl } from '../lib/skillslist';
 

export const StudentLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isStudentLogined = useAppStore((state) => state.isStudentLogined);

  useEffect(() => {
    if (!isStudentLogined) {
      const currentUrl = `${pathname}${searchParams?.toString() ? "?" + searchParams.toString() : ""}`;
      const encrypted = encryptRedirectUrl(currentUrl);

      router.push(`/?redirect=${encodeURIComponent(encrypted)}`);
    }
  }, [isStudentLogined, pathname, searchParams, router]);

  return (
    <>
      {isStudentLogined && (
        <div>
          <StudentNavBar />
          {children}
        </div>
      )}
    </>
  );
};
