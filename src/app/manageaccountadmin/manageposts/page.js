"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminLayout } from "@/app/components/AdminLayout";
import RichEditor from "@/app/components/RichEditor"; // your TipTap editor with toolbar
import { useSearchParams, useRouter } from "next/navigation";
import { SkillDrp } from "@/app/components/SkillDrp";
 

export default function ManagePosts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id"); // <-- edit mode if present

  const [skill, setSkill] = useState("html");
  const [section, setSection] = useState("");
  const [type, setType] = useState("qa");
  const [title, setTitle] = useState("");
  const [answer, setAnswer] = useState(""); // RichEditor content
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ✅ Fetch post if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      setLoading(true);
      axios
        .get(`/api/posts/${id}`)
        .then((res) => {
          const post = res?.data?.post;
         
          if (post) {
            setSkill(post.skill || "html");
            setSection(post.section || "");
            setType(post.type || "qa");
            setTitle(post.title || "");
            setAnswer(post.answer || "");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch post:", err);
          toast.error("Failed to load post");
        })
        .finally(() => setLoading(false));
    } else {
      setIsEditMode(false);
      resetForm();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (isEditMode) {
        // update
        await axios.put("/api/posts", {
          id,
          skill,
          section,
          type,
          title,
          answer,
        });
        toast.success("Post updated successfully!");
        setMessage("✅ Post updated successfully!");
        // 👇 after edit, reset to add mode
        router.push("/manageaccountadmin/posthistory"); 
      } else {
        // create
        await axios.post("/api/posts", {
          skill,
          section,
          type,
          title,
          answer,
        });
        toast.success("Post created successfully!");
        setMessage("✅ Post created successfully!");
        resetForm();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save post!");
      setMessage("❌ Failed to save post!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSkill("html");
    setSection("");
    setType("qa");
    setTitle("");
    setAnswer("");
    setMessage("");
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        
        <h3 className="mb-4">
          {isEditMode ? "Edit Post" : "Create a New Post"}
        </h3>

        {message && (
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Skill dropdown */}
          <div className="mb-3">
            <label className="form-label">Skill</label>
            <SkillDrp skill={skill} setSkill={setSkill} required={true} showAllOption={false}></SkillDrp>
            
          </div>

          {/* Section */}
          <div className="mb-3">
            <label className="form-label">Section</label>
            <input
              type="text"
              className="form-control"
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
          </div>

          {/* Type dropdown */}
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="qa">QA</option>
              <option value="article">Article</option>
            </select>
          </div>

          {/* Title */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Rich Editor with TipTap */}
          <div className="mb-3">
            <label className="form-label">Answer</label>
            <RichEditor value={answer} onChange={setAnswer} />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Post"
              : "Save Post"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
