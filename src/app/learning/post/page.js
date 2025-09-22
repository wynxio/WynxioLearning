'use client';
import { useEffect, useState,Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Spinner, Card } from "react-bootstrap";
import { StudentLayout } from "@/app/components/StudentLayout";

export default function PostView() {
  const searchParams = useSearchParams();
  const [postId, setPostId] = useState(null); // move postId to state

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get("postid");
    if (!id) return;

    setPostId(id);

    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${id}`);
        if (data.success) {
          setPost(data.post);
        }
      } catch (err) {
        console.error("Failed to fetch post", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <StudentLayout>
      <div className="container py-4">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <Spinner animation="border" />
          </div>
        ) : !post ? (
          <p className="text-center text-muted">Post not found.</p>
        ) : (
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-3">{post.title}</h2>
              <p className="text-muted mb-1">
                <strong>Section:</strong> {post.section}
              </p>
              <p className="text-muted mb-4">
                <strong>Skill:</strong> {post.skill}
              </p>
              <div
                className="post-answer"
                dangerouslySetInnerHTML={{ __html: post.answer }}
              />
            </Card.Body>
          </Card>
        )}
      </div>
    </StudentLayout>
    </Suspense>
  );
}
