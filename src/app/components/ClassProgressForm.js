"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

export default function ClassProgressForm({ item, onClose, onSaved }) {
  const [classDate, setClassDate] = useState("");
  const [description, setDescription] = useState([{ description: "", link: "" }]);
  const [publish, setPublish] = useState(false);
  const [batch, setBatch] = useState(""); // <-- new batch state
  const [batches, setBatches] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load batches from API
    const fetchBatches = async () => {
      try {
        const res = await fetch("/api/batches");
        const data = await res.json();
        if (data.success) setBatches(data.batches);
        else toast.error(data.error || "Failed to fetch batches");
      } catch (err) {
        toast.error("Error fetching batches");
      }
    };
    fetchBatches();
  }, []);

  useEffect(() => {
    if (item) {
      setClassDate(item.classDate);
      setDescription(item.description.length ? item.description : [{ description: "", link: "" }]);
      setPublish(item.publish);
      setBatch(item.batch || "");
    }
  }, [item]);

  const handleAddDescription = () => {
    setDescription([...description, { description: "", link: "" }]);
  };

  const handleRemoveDescription = (index) => {
    const updated = [...description];
    updated.splice(index, 1);
    setDescription(updated.length ? updated : [{ description: "", link: "" }]);
  };

  const handleChangeDescription = (index, field, value) => {
    const updated = [...description];
    updated[index][field] = value;
    setDescription(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = { classDate, description, publish, batch };

    try {
      const res = await fetch(item ? "/api/classprogress" : "/api/classprogress", {
        method: item ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item ? { ...payload, id: item._id } : payload)
      });

      const data = await res.json();
      if (data.success) {
        toast.success(item ? "Updated successfully" : "Added successfully");
        onSaved();
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch (err) {
      toast.error("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{item ? "Edit Class Progress" : "Add Class Progress"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Class Date</Form.Label>
            <Form.Control
              type="date"
              value={classDate}
              onChange={(e) => setClassDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Batch</Form.Label>
            <Form.Select value={batch} onChange={(e) => setBatch(e.target.value)} required>
              <option value="">Select Batch</option>
              {batches?.map((b) => (
                <option key={b.shortCode} value={b.shortCode}>{b.name}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Label>Descriptions</Form.Label>
          {description.map((d, idx) => (
            <div key={idx} className="mb-2 d-flex gap-2">
              <Form.Control
                placeholder="Description"
                value={d.description}
                onChange={(e) => handleChangeDescription(idx, "description", e.target.value)}
                required
              />
              <Form.Control
                placeholder="Link (optional)"
                value={d.link}
                onChange={(e) => handleChangeDescription(idx, "link", e.target.value)}
              />
              <Button variant="danger" onClick={() => handleRemoveDescription(idx)}>X</Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={handleAddDescription}>Add Description</Button>

          <Form.Group className="mt-3">
            <Form.Check
              type="checkbox"
              label="Publish"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
          </Form.Group>

          <div className="mt-3">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button variant="secondary" className="ms-2" onClick={onClose}>Cancel</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
