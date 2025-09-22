"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Pagination } from "react-bootstrap";
import { AdminLayout } from "@/app/components/AdminLayout";
import { Copy, Trash } from "lucide-react";
import { toast } from "react-toastify";

export default function FileHistory() {
  const [files, setFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const fetchFiles = async (pageNum = 1) => {
    try {
      const res = await axios.get(`/api/fileuploads?page=${pageNum}&limit=${limit}`);
      if (res.data.success) {
        setFiles(res.data.data);
        setTotal(res.data.total);
        setPage(res.data.page);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load files");
    }
  };

  useEffect(() => {
    fetchFiles(page);
  }, [page]);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    toast.info("Copied to clipboard!");
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`/api/fileuploads?id=${id}`);
      toast.success("File deleted");
      fetchFiles(page);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting file");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="container py-4">
        <h2 className="mb-4">File History</h2>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Copy URL</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f._id}>
                <td>
                  {f.mimeType.startsWith("image/") ? (
                    <img
                      src={f.url}
                      alt="thumb"
                      style={{ width: "80px", height: "auto" }}
                    />
                  ) : f.mimeType.startsWith("video/") ? (
                    <video
                      src={f.url}
                      style={{ width: "120px", height: "auto" }}
                      controls
                    />
                  ) : (
                    <div className="d-flex align-items-center">
                      <i className="bi bi-file-earmark-text" style={{ fontSize: "2rem" }}></i>
                      <span className="ms-2">Document</span>
                    </div>
                  )}
                </td>

                <td>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleCopy(f.url)}
                  >
                    <Copy size={18} />
                  </Button>
                </td>
                <td>
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDelete(f._id)}
                  >
                    <Trash size={18} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {totalPages > 1 && (
          <Pagination>
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        )}
      </div>
    </AdminLayout>
  );
}
