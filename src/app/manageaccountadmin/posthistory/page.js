"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Form, Modal } from "react-bootstrap";
import { AdminLayout } from "@/app/components/AdminLayout";
import { useRouter } from "next/navigation";
import { SkillDrp } from "@/app/components/SkillDrp";
import PostAdditionalFiles from "@/app/components/PostAdditionalFiles"; // new component
 
 

export default function PostHistory() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(30);
  const [totalPages, setTotalPages] = useState(1);

  // filters
  const [skill, setSkill] = useState("");
  const [search, setSearch] = useState("");

  const router = useRouter();

  // popup state
  const [showModal, setShowModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts", {
        params: { page, limit, skill, search },
      });
      if (data.success) {
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, skill, search]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await axios.delete(`/api/posts?id=${id}`);
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post", err);
    }
  };

  const handleEdit = (id) => {
    router.push(`/manageaccountadmin/manageposts?id=${id}`);
  };

  const handleManageFiles = (id) => {
    setSelectedPostId(id);
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <div className="container py-4">
        <h2 className="mb-4">Posts History</h2>

        {/* Filters */}
        <div className="d-flex mb-3 gap-2">
          <SkillDrp
            skill={skill}
            setSkill={setSkill}
            required={false}
            showAllOption={true}
            customClass="form-select width50"
          />
          <Form.Control
            type="text"
            placeholder="Search by section, title or answer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="width50"
          />
        </div>

        {/* Posts Table */}
        <Table bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Section</th>
              <th>Skill</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.section}</td>
                  <td>{post.skill}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(post._id)}
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(post._id)}
                      className="me-2"
                    >
                      Delete
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleManageFiles(post._id)}
                    >
                      Manage Additional Files
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="d-flex justify-content-between mt-3">
          <Button
            variant="secondary"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <span>
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modal for managing additional files */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Manage Additional Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPostId && (
            <PostAdditionalFiles postId={selectedPostId} />
          )}
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
}
