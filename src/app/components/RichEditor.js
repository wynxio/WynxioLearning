"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import HardBreak from "@tiptap/extension-hard-break";
import { useEffect } from "react";

function MenuBar({ editor }) {
  if (!editor) return null;

  const addImage = () => {
    const url = prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutube = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.chain().focus().setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleCodeBlock().run();
        }}
        className={editor.isActive("codeBlock") ? "btn btn-dark" : "btn btn-light"}
      >
        {"</>"}
      </button>
      <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}>─</button>
      <button type="button" onClick={addImage}>🖼️</button>
      <button type="button" onClick={addYoutube}>▶️</button>
    </div>
  );
}

export default function RichEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Heading.configure({ levels: [1, 2, 3] }),
      Image,
      Youtube,
      CodeBlock,
      Blockquote,
      HorizontalRule,
      HardBreak,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 👇 react to parent prop changes
  useEffect(() => {
    if (!editor) return;
    if (value === "" && editor.getHTML() !== "<p></p>") {
      // clear content
      editor.commands.clearContent();
    } else if (value && value !== editor.getHTML()) {
      // reset content if value changes
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="border rounded p-2 min-h-[200px]" />
    </div>
  );
}
