"use client";

import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function AddEditFileModal({ show, onHide, file, refresh }) {
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (file) {
      setDescription(file.description);
      setLink(file.link);
    } else {
      setDescription("");
      setLink("");
    }
  }, [file]);

  const handleSave = async () => {
    const payload = { description, link };

    const method = file ? "PUT" : "POST";
    if (file) payload.id = file._id;

    await fetch("/api/uploadedfiles", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    refresh();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{file ? "Edit File" : "Add File"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button onClick={handleSave}>{file ? "Update" : "Save"}</Button>
      </Modal.Footer>
    </Modal>
  );
}
