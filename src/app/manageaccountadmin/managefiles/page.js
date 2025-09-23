"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Copy } from "lucide-react"; // icon for copy

export default function ManageFiles() {
  const [file, setFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/fileuploads", formData);

      if (res.data.success) {
        // Construct full public URL (assuming Next.js public folder)
        const uniqueName = res.data.fileName; // backend should return this
        const url = `${window.location.origin}/uploads/${uniqueName}`;
        setUploadedUrl(url);
        toast.success("File uploaded successfully!");
      } else {
        toast.error(res.data.error || "Upload failed");
      }
    } catch (err) {
      console.clear();
      console.error('err',err);
      
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(uploadedUrl);
    toast.info("Copied to clipboard!");
  };

  const resetForm = () => {
    setFile(null);
    setUploadedUrl("");
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h3 className="mb-4">Upload a New File</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>

        {uploadedUrl && (
          <div className="mt-4">
            <label className="form-label">File URL</label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={uploadedUrl}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleCopy}
              >
                <Copy size={18} />
              </button>
            </div>

            <button
              className="btn btn-secondary mt-3"
              onClick={resetForm}
            >
              Upload Another File
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
