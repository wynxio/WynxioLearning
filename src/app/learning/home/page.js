"use client";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { Accordion, Form, Button } from "react-bootstrap";


import { StudentLayout } from "@/app/components/StudentLayout";
import { FaExternalLinkAlt } from "react-icons/fa"; // new window icon
import { useRouter } from "next/navigation";
import { StudentSkillDrp } from "@/app/components/StudentSkillDrp";
import FilePreviewModal from "@/app/components/FilePreviewModal";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page] = useState(1); // not needed for students, just 1 page
  const [limit] = useState(1000); // fetch enough results
  const [skill, setSkill] = useState("");
  const [search, setSearch] = useState("");

  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const router = useRouter();

  const fetchPosts = async () => {
    try {
      if (!skill && !search) {
        setPosts([]); // show nothing initially
        return;
      }
      const { data } = await axios.get("/api/posts", {
        params: { page, limit, skill, search },
      });
      if (data.success) {
        setPosts(data.posts);
  
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    }
  };

  const openPreview = (file) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  useEffect(() => {
    fetchPosts();
  }, [skill, search]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentLayout>
        <div className="learningHomeContainer">
          <div className="learninginterviewSection">
            <h2 className="mb-4">Interview Training and Notes</h2>

            {/* Filters */}
            <div className="d-flex mb-4 gap-3 flex-wrap">
              <StudentSkillDrp
                skill={skill}
                setSkill={setSkill}
                required={false}
                showAllOption={true}
                customClass="form-select w-auto"
              />
              <Form.Control
                type="text"
                placeholder="Search by section, title or answer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-grow-1"
              />
            </div>

            {/* Accordion */}
            {posts.length === 0 ? (
              <div className="text-muted text-center mt-5">
                Select a skill or search to view posts.
              </div>
            ) : (
              <Accordion alwaysOpen>
                {posts.map((post, idx) => (
                  <Accordion.Item eventKey={String(idx)} key={post._id}>
                    <Accordion.Header>
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <span>{post.title}</span>
                        {/* <FaExternalLinkAlt
                      className="ms-2 text-primary cursor-pointer"
                      title="Open in new window"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent accordion toggle
                        router.push(`/learning/post?postid=${post._id}`);
                      }}
                    /> */}
                        {/* <a target="_blank" href={`/learning/post?postid=${post._id}`} className="ms-2">open</a> */}
                      </div>
                    </Accordion.Header>
                    <Accordion.Body>
                      {post.section && (
                        <>
                          <p>
                            <strong>Section:</strong> {post.section}
                          </p>
                          <div>
                            <ul>
                              {post?.additionalFiles?.map((d, idx) => (
                                <li key={idx}>
                                  {d.description}{" "}
                                  {d.filepath && (
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
                          </div>
                        </>
                      )}
                      <div
                        dangerouslySetInnerHTML={{ __html: post.answer }}
                        className="post-answer"
                      />
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}

            <FilePreviewModal
              show={showPreview}
              onHide={() => setShowPreview(false)}
              file={previewFile}
              link={previewFile?.filepath}
              filetype={previewFile?.filetype}
            />
          </div>
        </div>
      </StudentLayout>
    </Suspense>
  );
}
