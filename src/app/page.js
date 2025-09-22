'use client';

 
import '../app/Styles/Intro.css';
 
import { PublicLayout } from "./components/PublicLayout";
import { StudentLogin } from './components/StudentLogin';


export default function Home() {
 

  return (
    <PublicLayout>
      <StudentLogin />
    </PublicLayout>
  );
}
