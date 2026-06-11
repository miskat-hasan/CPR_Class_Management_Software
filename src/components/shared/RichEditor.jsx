"use client";

import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const RichTextEditor = forwardRef((_, ref) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ font: [] }],
            [{ size: ["small", false, "large", "huge"] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ script: "sub" }, { script: "super" }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
            ],
            [{ direction: "rtl" }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["blockquote", "code-block"],
            ["clean"],
          ],
        },
        placeholder: "Write something...",
      });
    }

    return () => {
      quillRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return quillRef.current?.root.innerHTML || "";
    },

    setContents: htmlContent => {
      if (quillRef.current) {
        if (htmlContent) {
          // Use clipboard.dangerouslyPasteHTML to set HTML content
          quillRef.current.clipboard.dangerouslyPasteHTML(htmlContent);
        } else {
          quillRef.current.setText("");
        }
      }
    },

    clear: () => {
      if (quillRef.current) {
        quillRef.current.setText("");
      }
    },
  }));

  return (
    <div className="rich-editor">
      <div ref={editorRef} style={{ height: "300px" }} />
    </div>
  );
});

RichTextEditor.displayName = "RichTextEditor";
export default RichTextEditor;
