"use client";

import { useEffect, useState } from "react";
import { Button, Table, Pagination, Spinner } from "react-bootstrap";
import { AdminLayout } from "@/app/components/AdminLayout";
import FilePreviewModal from "@/app/components/FilePreviewModal";
import AddEditFileModal from "@/app/components/AddEditFileModal";
import { Clipboard } from "react-bootstrap-icons"; // 📋 copy icon
import { toast } from "react-toastify";


export default function UploadedFiles() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    const [previewFile, setPreviewFile] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const [showAddEdit, setShowAddEdit] = useState(false);
    const [editFile, setEditFile] = useState(null);

    // Fetch files
    const fetchFiles = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/uploadedfiles?page=${page}&limit=${limit}`);
            const data = await res.json();
            if (data.success) {
                setFiles(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (err) {
            console.error("Error fetching files:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [page]);

    const openPreview = (file) => {
        setPreviewFile(file);
        setShowPreview(true);
    };

    const openAdd = () => {
        setEditFile(null);
        setShowAddEdit(true);
    };

    const openEdit = (file) => {
        setEditFile(file);
        setShowAddEdit(true);
    };

    const handleDelete = async (file) => {
        if (!window.confirm(`Are you sure you want to delete "${file.description}"?`)) {
            return;
        }

        try {
            await fetch(`/api/uploadedfiles?id=${file._id}`, {
                method: "DELETE",
            });
            fetchFiles();
        } catch (err) {
            console.error("Error deleting file:", err);
        }
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.info("Link copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <AdminLayout>


            {/* <div className="container py-4">
                <div className="centerFlex">
                    <iframe src="https://www.fileswynxio.com/fileuploadwynxioadmins/"   style={{ width: "100%", border:"2px solid #ccc" }}></iframe>
                </div>

            </div> */}
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Uploaded Files</h2>
                    <Button onClick={openAdd}>+ Add Existing File Info</Button>
                    <a target="_blank" href="https://www.fileswynxio.com/fileuploadwynxioadmins"><Button  >Upload New File</Button></a>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Link</th>
                                <th>Preview</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((d) => (
                                <tr key={d._id}>
                                    <td>{d.description}</td>
                                    <td className="d-flex align-items-center gap-2">
                                        <a href={d.link} target="_blank" rel="noreferrer">
                                            {d.link}
                                        </a>
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => handleCopy(d.link)}
                                            style={{ padding: "0 4px" }}
                                        >
                                            <Clipboard />
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="link"
                                            onClick={() => openPreview(d)}
                                            style={{ padding: 0 }}
                                        >
                                            (Preview)
                                        </Button>
                                    </td>
                                    <td>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => openEdit(d)}
                                            className="me-2"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(d)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}

                {/* Pagination */}
                <Pagination>
                    {[...Array(totalPages).keys()].map((num) => (
                        <Pagination.Item
                            key={num + 1}
                            active={num + 1 === page}
                            onClick={() => setPage(num + 1)}
                        >
                            {num + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>

                {/* Preview Modal */}
                <FilePreviewModal
                    show={showPreview}
                    onHide={() => setShowPreview(false)}
                    file={previewFile}
                    link={previewFile?.link}
                    filetype={previewFile?.filetype}
                />

                {/* Add/Edit Modal */}
                <AddEditFileModal
                    show={showAddEdit}
                    onHide={() => setShowAddEdit(false)}
                    file={editFile}
                    refresh={fetchFiles}
                />
            </div>
        </AdminLayout>
    );
}
