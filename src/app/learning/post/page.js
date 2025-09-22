"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Spinner, Card } from "react-bootstrap";
import { StudentLayout } from "@/app/components/StudentLayout";

export default function PostView() {
  const searchParams = useSearchParams();
  const postId = searchParams?.get("postid");  // safe access

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/api/posts/${postId}`);
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
  }, [postId]);

  return (
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
  );
}
