'use client';

import { useEffect, useState, Suspense } from "react";
import { StudentLayout } from "@/app/components/StudentLayout";
import useAppStore from "@/app/store/useStore";
import { Accordion, Spinner, Button } from "react-bootstrap";
import FilePreviewModal from "@/app/components/FilePreviewModal";


export default function ClassProgress() {
  const student_team = useAppStore((state) => state.student_team);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [previewFile, setPreviewFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!student_team) return;

    const fetchProgress = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/batchclassprogress?batch=${student_team}`);
        const json = await res.json();
        if (json.success) {
          setProgress(json.data);
        } else {
          console.error("Error fetching class progress:", json.error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [student_team]);

  const openPreview = (file) => {
    setPreviewFile(file);
    setShowPreview(true);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentLayout>
        <div className="container py-4">
          <h2 className="mb-4 text-center">
            Class Progress - Team {student_team}
          </h2>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : progress.length === 0 ? (
            <p className="text-center">No class progress found.</p>
          ) : (
            <Accordion defaultActiveKey="0">
              {progress.map((item, index) => (
                <Accordion.Item eventKey={index.toString()} key={item._id}>
                  <Accordion.Header>
                    {new Date(item.classDate).toLocaleDateString()}
                  </Accordion.Header>
                  <Accordion.Body>
                    {item.description && item.description.length > 0 ? (
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
                    ) : (
                      <p>No description available</p>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          )}
          <FilePreviewModal
            show={showPreview}
            onHide={() => setShowPreview(false)}
            file={previewFile}
            link={previewFile?.link}
            filetype={previewFile?.filetype}
          />
        </div>
      </StudentLayout>
    </Suspense>
  );
}
