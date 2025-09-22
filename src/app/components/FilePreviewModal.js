"use client";

import { Modal } from "react-bootstrap";

export default function FilePreviewModal({ show, onHide, file,link,filetype }) {
  if (!file) return null;

  // const { link, filetype } = file;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        {filetype === "image" && <img src={link} alt="preview" className="img-fluid" />}
        {filetype === "video" && <video src={link} controls className="w-100" />}
        {filetype === "audio" && <audio src={link} controls className="w-100" />}
        {filetype === "document" && (
          <a href={link} target="_blank" rel="noreferrer">
            Open Document
          </a>
        )}
        {filetype === "invalid" && <p>Cannot preview this file type.</p>}
      </Modal.Body>
    </Modal>
  );
}
