"use client";
import { useRouter } from "next/navigation";
import "../../Styles/Dashboard.css";
import { AdminLayout } from "@/app/components/AdminLayout";

export default function Dashboard() {
  const router = useRouter();

  // const handleNavigate = (title) => {
  //   const path = routes[title];
  //   if (path) router.push(path);
  // };

  return (
    <AdminLayout>
      <div className="Dashboard-container">
        <h1 className="Dashboard-heading">Welcome to DashBoard</h1>
        <h3 className="Dashboard-subheading">Manage your Posts .</h3>
        <div className="cards-grid">


          <div className="card">
            <h4>Create New Post</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/manageposts");
              }}
            >
              Create Post
            </button>
          </div>
          <div className="card">
            <h4>Post History</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/posthistory");
              }}
            >
              Post History
            </button>
          </div>

          <div className="card">
            <h4>File Upload</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/managefiles");
              }}
            >
              File Upload
            </button>
          </div>
          <div className="card">
            <h4>File History</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/filehistory");
              }}
            >
              File History
            </button>
          </div>
          <div className="card">
            <h4>Students</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/students");
              }}
            >
              Students
            </button>
          </div>
            <div className="card">
            <h4>Batches</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/batches");
              }}
            >
              Batches
            </button>
          </div>
           <div className="card">
            <h4>Class Progress</h4>
            <button
              onClick={(e) => {
                e.preventDefault();
                router.push("/manageaccountadmin/classprogress");
              }}
            >
              Class Progress
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
