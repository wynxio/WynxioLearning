'use client';
import React, { useEffect, useState } from 'react';
import useAppStore from '../store/useStore';
import { useRouter } from "next/navigation";
import { StudentNavBar } from './StudentNavBar';


export const PublicLayout = ({ children }) => {

  return (
    <div className='studentsMainContainer'>
      {children}
    </div>
  )
}
