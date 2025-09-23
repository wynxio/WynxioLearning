"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import useAppStore from "../store/useStore";

export const StudentNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const isStudentLogined = useAppStore((state) => state.isStudentLogined);
  const student_auth_name = useAppStore((state) => state.student_auth_name);
  const student_team = useAppStore((state) => state.student_team);
  const setStudentLogout = useAppStore((state) => state.setStudentLogout);

  const handleLogout = () => {
    setStudentLogout();
    router.push("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bgHeaderNav">
        <div className="container-fluid">
          {/* Brand */}
          <a className="navbar-brand text-white" >
            <div className="studentslogocontainer"><img src="/logo/learninglogo.png" className="studentslogo"></img>
               
            </div>
          </a>

          {/* Toggler for mobile */}
          {isStudentLogined && (
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNavDropdown"
              aria-controls="navbarNavDropdown"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          )}

          {/* Collapsible content */}
          {isStudentLogined && (
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav ms-auto">

                <li className="loginedStudentName">{student_auth_name}{` (Team ${student_team})`}</li>
                <li className="nav-item">

                  <a
                    className="nav-link text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>

      </nav>
      <div className="studentlinksShortcut">
        <a onClick={(e) => {
          e.preventDefault();
          router.push("/learning/dashboard");
        }}>Dashboard</a>

        <a onClick={(e) => {
          e.preventDefault();
          router.push("/learning/classprogress");
        }}>Class Progress</a>

        <a onClick={handleLogout}>Logout</a>
      </div>
    </>
  );
};
