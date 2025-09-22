"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Table } from "react-bootstrap";
import { getFileType } from "../lib/utils";


export default function PostAdditionalFiles({ postId }) {
    const [files, setFiles] = useState([]);
    const [newFile, setNewFile] = useState({ description: "", filepath: "",filetype:"" });

    const fetchFiles = async () => {
        try {
            const { data } = await axios.get("/api/postadditionalfiles", {
                params: { id: postId },
            });
            if (data.success) {
                setFiles(data.additionalFiles);
            }
        } catch (err) {
            console.error("Failed to fetch additional files", err);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [postId]);

    const handleAdd = async () => {
        if (!newFile.description || !newFile.filepath) return;
        try {
            await axios.post("/api/postadditionalfiles", {
                postId,
                additionalFiles: [newFile],
            });
            setNewFile({ description: "", filepath: "",filetype:"" });
            fetchFiles();
        } catch (err) {
            console.error("Failed to add file", err);
        }
    };

    const handleEditDescription = async (index, description) => {
        try {
            await axios.put("/api/postadditionalfiles", {
                postId,
                index,
                description,
            });
            fetchFiles();
        } catch (err) {
            console.error("Failed to edit file", err);
        }
    };
    const handleEditfilepath = async (index, filepath) => {
        try {
            await axios.put("/api/postadditionalfiles", {
                postId,
                index,
                filepath,
            });
            fetchFiles();
        } catch (err) {
            console.error("Failed to edit file", err);
        }
    };
    

    const handleDelete = async (index) => {
        if (!confirm("Are you sure you want to delete this file?")) return;
        try {
            await axios.delete(`/api/postadditionalfiles?id=${postId}&index=${index}`);
            fetchFiles();
        } catch (err) {
            console.error("Failed to delete file", err);
        }
    };

    return (
        <div>
            {/* List files */}
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th>File Path</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {files.length > 0 ? (
                        files.map((file, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                    <Form.Control
                                        type="text"
                                        defaultValue={file.description}
                                        onBlur={(e) =>
                                            handleEditDescription(idx, e.target.value)
                                        }
                                    />
                                </td>
                                <td><Form.Control
                                        type="text"
                                        defaultValue={file.filepath}
                                        onBlur={(e) =>
                                            handleEditfilepath(idx, e.target.value)
                                        }
                                    /></td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(idx)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center">
                                No files found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Add new file */}
            <div className="d-flex gap-2">
                <Form.Control
                    type="text"
                    placeholder="Description"
                    value={newFile.description}
                    onChange={(e) =>
                        setNewFile((prev) => ({ ...prev, description: e.target.value }))
                    }
                />
                <Form.Control
                    type="text"
                    placeholder="File Path"
                    value={newFile.filepath}
                    onChange={(e) =>
                        setNewFile((prev) => ({ ...prev, filepath: e.target.value,filetype:getFileType(e.target.value) }))
                    }
                />
                <Button onClick={handleAdd}>Add</Button>
            </div>
        </div>
    );
}
