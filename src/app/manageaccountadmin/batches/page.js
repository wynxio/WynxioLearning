"use client";

import { useEffect, useState } from "react";
import { Button, Table, Modal, Spinner, Form } from "react-bootstrap";
import { AdminLayout } from "@/app/components/AdminLayout";
import ManageBatch from "@/app/components/ManageBatch";
import { toast } from "react-toastify";
import Course from "@/app/lib/Courseslist";


export default function BatchesList() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(""); // course filter state

  // Fetch batches
  const fetchBatches = async () => {
    try {
      setLoading(true);
      let url = `/api/batches?page=1&limit=50`;
      if (selectedCourse) {
        url += `&course=${encodeURIComponent(selectedCourse)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBatches(data.batches);
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [selectedCourse]); // refetch whenever course filter changes

  // Delete batch
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this batch?")) return;
    try {
      const res = await fetch(`/api/batches?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Batch deleted");
        fetchBatches();
      } else {
        alert(data.error || "Failed to delete batch");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Open Add/Edit modal
  const handleOpenModal = (batch = null) => {
    setSelectedBatch(batch);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Manage Batches</h3>
          <Button onClick={() => handleOpenModal()} variant="primary">
            Add Batch
          </Button>
        </div>

        {/* Course Filter */}
        <div className="mb-3 d-flex align-items-center">
          <Form.Label className="me-2 mb-0">Filter by Course:</Form.Label>
          <Form.Select
            style={{ width: "250px" }}
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">All Courses</option>
            {Course.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </div>

        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Course</th>
                <th>Name</th>
                <th>Short Code</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Time Details</th>
                <th>Trainer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch._id}>
                    <td>{batch.course}</td>
                    <td>{batch.name}</td>
                    <td>{batch.shortCode}</td>
                    <td>{batch.startDate}</td>
                    <td>{batch.endDate}</td>
                    <td>{batch.timeDetails}</td>
                    <td>{batch.trainerDetails}</td>
                    <td>{batch.status}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleOpenModal(batch)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(batch._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No batches found
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
              {selectedBatch ? "Edit Batch" : "Add Batch"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ManageBatch
              batch={selectedBatch}
              onSuccess={() => {
                setShowModal(false);
                fetchBatches();
              }}
            />
          </Modal.Body>
        </Modal>
      </div>
    </AdminLayout>
  );
}
