"use client";

import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Course from "../lib/Courseslist";
import { toast } from "react-toastify";
 

export default function ManageBatch({ batch, onSuccess }) {
  const [form, setForm] = useState({
    course: "",
    name: "",
    shortCode: "",
    startDate: "",
    endDate: "",
    timeDetails: "",
    trainerDetails: "",
    status: "",
  });

  useEffect(() => {
    if (batch) {
      setForm(batch);
    }
  }, [batch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (batch) {
        // Update
        res = await fetch("/api/batches", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: batch._id }),
        });
      } else {
        // Create
        res = await fetch("/api/batches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const data = await res.json();
      if (data.success || data.message) {
        toast.success(batch ? "Batch updated" : "Batch added");
        onSuccess();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Save batch error:", err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Label>Course</Form.Label>
          <Form.Select
            name="course"
            value={form.course}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Course --</option>
            {Course.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>Batch Name</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>Short Code</Form.Label>
          <Form.Control
            name="shortCode"
            value={form.shortCode}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            placeholder="e.g. 01-Oct-2025"
          />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            placeholder="e.g. 30-Nov-2025"
          />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>Time Details</Form.Label>
          <Form.Control
            name="timeDetails"
            value={form.timeDetails}
            onChange={handleChange}
            placeholder="e.g. Mon-Fri, 6 PM - 8 PM"
          />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>Trainer Details</Form.Label>
          <Form.Control
            name="trainerDetails"
            value={form.trainerDetails}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="">-- Select Status --</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </div>
      </div>

      <Button type="submit" variant="success">
        {batch ? "Update Batch" : "Add Batch"}
      </Button>
    </Form>
  );
}
