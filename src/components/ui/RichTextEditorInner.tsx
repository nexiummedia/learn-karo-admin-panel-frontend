"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Unlink,
  Undo2,
  Redo2,
  Code,
} from "lucide-react";

export interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  error?: string;
  minHeight?: string;
}

export const RichTextEditorInner: React.FC<RichTextEditorProps> = ({ value, onChange, error }) => {
  const [linkInputVisible, setLinkInputVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-sky-600 underline hover:text-sky-700 font-medium",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes if editor content is different and not focused
  useEffect(() => {
    if (editor && value && editor.getHTML() !== value && !editor.isFocused) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white p-4 min-h-[220px] text-xs text-slate-400">
        Loading editor...
      </div>
    );
  }

  const setLink = () => {
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkInputVisible(false);
      return;
    }

    const formattedUrl = /^https?:\/\//i.test(linkUrl.trim())
      ? linkUrl.trim()
      : `https://${linkUrl.trim()}`;

    editor.chain().focus().extendMarkRange("link").setLink({ href: formattedUrl }).run();
    setLinkUrl("");
    setLinkInputVisible(false);
  };

  const openLinkModal = () => {
    const previousUrl = editor.getAttributes("link").href;
    setLinkUrl(previousUrl || "");
    setLinkInputVisible(!linkInputVisible);
  };

  return (
    <div
      className={`border rounded-xl bg-white overflow-hidden transition-all focus-within:ring-1 ${
        error
          ? "border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500"
          : "border-slate-200 focus-within:border-slate-900 focus-within:ring-slate-900"
      }`}
    >
      {/* Rich Text Toolbar */}
      <div className="bg-slate-50/90 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1 text-slate-700 select-none">
        {/* Text Styles */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("bold")
              ? "bg-slate-900 text-white font-bold"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("italic")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("underline")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("strike")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Heading 1"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 1 })
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("codeBlock")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <Code className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Links */}
        <button
          type="button"
          onClick={openLinkModal}
          title="Add Link"
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            editor.isActive("link")
              ? "bg-slate-900 text-white"
              : "hover:bg-slate-200/70 text-slate-700"
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
            className="p-1.5 rounded hover:bg-slate-200/70 text-rose-600 transition-colors cursor-pointer"
          >
            <Unlink className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          className="p-1.5 rounded hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          className="p-1.5 rounded hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inline Link Input Popup */}
      {linkInputVisible && (
        <div className="bg-slate-100 p-2.5 border-b border-slate-200 flex items-center gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setLink();
              } else if (e.key === "Escape") {
                setLinkInputVisible(false);
              }
            }}
            placeholder="Enter web link (e.g. https://learnkaro.com)..."
            className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            autoFocus
          />
          <button
            type="button"
            onClick={setLink}
            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setLinkInputVisible(false)}
            className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div
        className="w-full text-xs sm:text-sm text-slate-800 font-sans leading-relaxed
        [&_.tiptap]:focus:outline-none
        [&_.tiptap]:p-4
        [&_.tiptap]:min-h-[200px]
        [&_.tiptap_p]:my-2
        [&_.tiptap_p]:leading-relaxed
        [&_.tiptap_h1]:text-xl
        [&_.tiptap_h1]:font-bold
        [&_.tiptap_h1]:text-slate-900
        [&_.tiptap_h1]:mt-4
        [&_.tiptap_h1]:mb-2
        [&_.tiptap_h2]:text-lg
        [&_.tiptap_h2]:font-bold
        [&_.tiptap_h2]:text-slate-900
        [&_.tiptap_h2]:mt-3
        [&_.tiptap_h2]:mb-1.5
        [&_.tiptap_h3]:text-sm
        [&_.tiptap_h3]:font-semibold
        [&_.tiptap_h3]:text-slate-800
        [&_.tiptap_h3]:mt-2
        [&_.tiptap_h3]:mb-1
        [&_.tiptap_ul]:list-disc
        [&_.tiptap_ul]:pl-5
        [&_.tiptap_ul]:my-2.5
        [&_.tiptap_ul_li]:my-0.5
        [&_.tiptap_ol]:list-decimal
        [&_.tiptap_ol]:pl-5
        [&_.tiptap_ol]:my-2.5
        [&_.tiptap_ol_li]:my-0.5
        [&_.tiptap_blockquote]:border-l-3
        [&_.tiptap_blockquote]:border-slate-300
        [&_.tiptap_blockquote]:pl-3.5
        [&_.tiptap_blockquote]:italic
        [&_.tiptap_blockquote]:text-slate-600
        [&_.tiptap_blockquote]:my-3
        [&_.tiptap_code]:bg-slate-100
        [&_.tiptap_code]:text-slate-800
        [&_.tiptap_code]:px-1.5
        [&_.tiptap_code]:py-0.5
        [&_.tiptap_code]:rounded
        [&_.tiptap_code]:font-mono
        [&_.tiptap_code]:text-xs
        [&_.tiptap_pre]:bg-slate-900
        [&_.tiptap_pre]:text-slate-100
        [&_.tiptap_pre]:p-3.5
        [&_.tiptap_pre]:rounded-lg
        [&_.tiptap_pre]:my-3
        [&_.tiptap_pre]:overflow-x-auto"
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
