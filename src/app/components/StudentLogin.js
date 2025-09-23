"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "../Styles/LoginPage.css";
import useAppStore from "../store/useStore"; // Zustand store
import { decryptRedirectUrl } from "../lib/skillslist";
import { jwtDecode } from "jwt-decode";

export const StudentLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const setStudentLogin = useAppStore((state) => state.setStudentLogin);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const goToDashBoard = () => {
    if (redirect) {
      router.push(decryptRedirectUrl(redirect));
    } else {
      router.push("/learning/dashboard");
    }
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/studentlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!result.success) {
        alert(result.error || "Invalid username or password");
        setLoading(false);
        return;
      }

      // decode JWT to get student info
      const decoded = jwtDecode(result.token);
      const { name, allowedSkills,team } = decoded;

      // ✅ Save student info into Zustand store
      setStudentLogin(name, allowedSkills,team);

      // Optionally store token in localStorage for later API calls
      localStorage.setItem("studentToken", result.token);
      localStorage.setItem("studentTeam", team);

      goToDashBoard();
    } catch (err) {
      console.clear();
      console.log('err',err)
   
       
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="students-login-container">
      <div className="login-box">
        <div className="centerFlex"><img src="/logo/logoblack.png" className="studentslogologin"></img></div>
        <h1 className="login-title">Student Login</h1>
         
        <form style={{ width: "300px" }} onSubmit={submitLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
