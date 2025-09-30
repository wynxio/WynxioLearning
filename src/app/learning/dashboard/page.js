'use client';
import Link from "next/link";
import { StudentLayout } from "@/app/components/StudentLayout";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentLayout>
        <div className="container py-4">
          <h2 className="mb-4 text-center">Students Dashboard</h2>

          <div className="row g-4">
            {/* Interview Training Card */}
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">Interview Training & Notes</h5>
                    <p className="card-text mt-5">
                      Practice with skill-wise interview questions and answers to boost
                      your confidence before real interviews.
                    </p>
                  </div>
                  <Link href="/learning/home" className="btn btn-primary mt-5">
                    Go to Training
                  </Link>
                </div>
              </div>
            </div>

            {/* Class Progress Card */}
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">Class Progress</h5>
                    <p className="card-text mt-5">
                      See what you’ve learned in each class and track your progress.
                    </p>
                  </div>
                  <Link href="/learning/classprogress" className="btn btn-success mt-5">
                    View Progress
                  </Link>
                </div>
              </div>
            </div>
             <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title">HTML Class Recordings</h5>
                    <p className="card-text mt-5">
                      HTML Class Recordings
                    </p>
                  </div>
                  <Link href="/learning/htmlclasses" className="btn btn-success mt-5">
                    View Recordings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StudentLayout>
    </Suspense>
  );
}
