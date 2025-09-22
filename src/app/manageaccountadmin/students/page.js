"use client";

import { useEffect, useState } from "react";
import { Button, Table, Modal, Spinner } from "react-bootstrap";
import { AdminLayout } from "@/app/components/AdminLayout";
import ManageStudent from "@/app/components/ManageStudent";
import { toast } from "react-toastify";
 

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students?page=1&limit=50");
      
      const data = await res.json();
      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`/api/students?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Student deleted");
        fetchStudents();
      } else {
        alert(data.error || "Failed to delete student");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Open Add/Edit modal
  const handleOpenModal = (student = null) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Students List</h3>
          <Button onClick={() => handleOpenModal()} variant="primary">
            Add Student
          </Button>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Team</th>
                <th>Qualification</th>
                <th>Confirmed Fees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.team}</td>
                    <td>{student.qualification}</td>
                    <td>{student.confirmedfees}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpenModal(student)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}

        {/* Modal for Add/Edit */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedStudent ? "Edit Student" : "Add Student"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ManageStudent
              student={selectedStudent}
              onSuccess={() => {
                setShowModal(false);
                fetchStudents();
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
}
