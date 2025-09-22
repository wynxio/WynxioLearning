"use client";

import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import SkillsList from "../lib/skillslist";
  

export default function ManageStudent({ student, onSuccess }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    qualification: "",
    team: "",
    confirmedfees: "",
    comments: "",
    fees1: "",
    fees2: "",
    fees3: "",
    fees4: "",
    fees5: "",
    allowedSkills: SkillsList.map((s) => s.name), // default all skills
  });

  const [batches, setBatches] = useState([]);

  useEffect(() => {
    if (student) {
      setForm({
        ...student,
        allowedSkills:
          student.allowedSkills && student.allowedSkills.length > 0
            ? student.allowedSkills
            : SkillsList.map((s) => s.name), // fallback all checked
      });
    }
  }, [student]);

  // Fetch batches for dropdown
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await fetch("/api/batches?limit=100");
        const data = await res.json();
        if (data.success) {
          setBatches(data.batches || []);
        }
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };
    fetchBatches();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (skillName) => {
    setForm((prev) => {
      let updatedSkills;
      if (prev.allowedSkills.includes(skillName)) {
        updatedSkills = prev.allowedSkills.filter((s) => s !== skillName);
      } else {
        updatedSkills = [...prev.allowedSkills, skillName];
      }
      return { ...prev, allowedSkills: updatedSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (student) {
        res = await fetch("/api/students", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: student._id }),
        });
      } else {
        res = await fetch("/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      const data = await res.json();
      if (data.success || data.message) {
        toast.success(student ? "Student updated" : "Student added");
        onSuccess();
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Save student error:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* Team replaced with Dropdown */}
        <div className="col-md-6 mb-3">
          <Form.Label>Team (Batch)</Form.Label>
          <Form.Select
            name="team"
            value={form.team}
            onChange={handleChange}
          >
            <option value="">-- Select Batch --</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch.shortCode}>
                {batch.name}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="col-md-6 mb-3">
          <Form.Label>Qualification</Form.Label>
          <Form.Control
            name="qualification"
            value={form.qualification}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6 mb-3">
          <Form.Label>Confirmed Fees</Form.Label>
          <Form.Control
            name="confirmedfees"
            value={form.confirmedfees}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-12 mb-3">
          <Form.Label>Comments</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="comments"
            value={form.comments}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Fees breakdown */}
      <div className="row">
        {["fees1", "fees2", "fees3", "fees4", "fees5"].map((f) => (
          <div className="col-md-4 mb-3" key={f}>
            <Form.Label>{f.toUpperCase()}</Form.Label>
            <Form.Control
              name={f}
              value={form[f]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      {/* Allowed Skills */}
      <div className="mb-3">
        <Form.Label>Allowed Skills</Form.Label>
        <div className="d-flex flex-wrap">
          {SkillsList?.map((skill) => (
            <Form.Check
              key={skill.id}
              type="checkbox"
              label={skill.name}
              checked={form.allowedSkills.includes(skill.name)}
              onChange={() => handleSkillChange(skill.name)}
              className="me-3 mb-2"
            />
          ))}
        </div>
      </div>

      <Button type="submit" variant="success">
        {student ? "Update" : "Add"} Student
      </Button>
    </Form>
  );
}
