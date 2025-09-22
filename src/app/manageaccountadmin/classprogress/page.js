"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Accordion, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import ClassProgressForm from "@/app/components/ClassProgressForm";
import FilePreviewModal from "@/app/components/FilePreviewModal";

export default function ManageClassProgress() {
  const [classProgress, setClassProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [batches, setBatches] = useState([]);
  const [filterBatch, setFilterBatch] = useState("");

  // Fetch batches
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

  // Fetch all class progress
  const fetchClassProgress = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/classprogress");
      const data = await res.json();
      if (data.success) {
        const sorted = data.data.sort((a, b) => new Date(b.classDate) - new Date(a.classDate));
        setClassProgress(sorted);
      } else {
        toast.error(data.error || "Failed to fetch class progress");
      }
    } catch (err) {
      toast.error("Error fetching class progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchClassProgress();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this class progress?")) return;
    try {
      const res = await fetch(`/api/classprogress?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted successfully");
        fetchClassProgress();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting class progress");
    }
  };

  const openPreview = (file) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  // Map shortcode to readable name
  const getBatchName = (shortCode) => {
    const batch = batches.find((b) => b.shortCode === shortCode);
    return batch ? batch.name : shortCode;
  };

  // Filtered class progress
  const filteredProgress = filterBatch
    ? classProgress.filter((item) => item.batch === filterBatch)
    : classProgress;

  return (
    <AdminLayout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Manage Class Progress</h2>
          <Button onClick={() => { setSelectedItem(null); setShowForm(true); }}>
            Add Class Progress
          </Button>
        </div>

        <div className="mb-3">
          <Form.Label>Filter by Batch:</Form.Label>
          <Form.Select
            value={filterBatch}
            onChange={(e) => setFilterBatch(e.target.value)}
          >
            <option value="">All Batches</option>
            {batches?.map((b) => (
              <option key={b.shortCode} value={b.shortCode}>
                {b.name}
              </option>
            ))}
          </Form.Select>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Accordion defaultActiveKey="">
            {filteredProgress.map((item) => (
              <Accordion.Item eventKey={item._id} key={item._id} className="classProgressAccordion">
                <Accordion.Header>
                  
                  
                  <table>
                    <tbody>
<tr>
                      <td><div>{item.classDate}   {item.publish ? "(Published)" : "(Unpublished)"}</div></td>
                    </tr>
                    <tr><td><div>{getBatchName(item.batch)}</div></td></tr>
                    </tbody>
                    
                  </table>
                </Accordion.Header>
                <Accordion.Body>
                  <ul>
                    {item.description.map((d, idx) => (
                      <li key={idx}>
                        {d.description}{" "}
                        {d.link && (
                          <Button
                            variant="link"
                            onClick={() => openPreview(d)}
                            style={{ padding: 0 }}
                          >
                            (Preview)
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => { setSelectedItem(item); setShowForm(true); }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}

        {showForm && (
          <ClassProgressForm
            item={selectedItem}
            onClose={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); fetchClassProgress(); }}
          />
        )}

        <FilePreviewModal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          file={previewFile}
          link={previewFile?.link}
          filetype={previewFile?.filetype}
        />
      </div>
    </AdminLayout>
  );
}
