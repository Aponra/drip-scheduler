"use client";

import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  type Ref,
} from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";

export type EditorChange = { json: object; plainText: string };

export type EditorHandle = {
  setHtml: (html: string) => void;
  setJson: (json: object) => void;
  setText: (text: string) => void;
  focus: () => void;
};

type Props = {
  initialJson?: object | null;
  initialText?: string;
  onChange: (change: EditorChange) => void;
  placeholder?: string;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={
        "inline-flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-sm font-medium transition-colors " +
        (active
          ? "bg-purple-100 text-purple-700"
          : "text-gray-700 hover:bg-gray-100")
      }
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-gray-200" aria-hidden="true" />;
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  function applyLink() {
    const previous = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (leave empty to remove)", previous ?? "");
    if (url === null) return; // cancelled
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }

  function applyColor(value: string) {
    editor!.chain().focus().setColor(value).run();
  }

  function clearColor() {
    editor!.chain().focus().unsetColor().run();
  }

  function applyHighlight(value: string) {
    editor!.chain().focus().setHighlight({ color: value }).run();
  }

  function clearHighlight() {
    editor!.chain().focus().unsetHighlight().run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/60 px-2 py-1.5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline (Ctrl+U)"
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editor.isActive("paragraph")}
        title="Paragraph"
      >
        ¶
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet list"
      >
        •
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Numbered list"
      >
        1.
      </ToolbarButton>
      <Divider />
      <ToolbarButton
        onClick={applyLink}
        active={editor.isActive("link")}
        title="Add or remove link"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-4 w-4"
        >
          <path d="M10 13a5 5 0 0 0 7.07 0l1.41-1.41a5 5 0 0 0-7.07-7.07l-1.41 1.41" />
          <path d="M14 11a5 5 0 0 0-7.07 0L5.52 12.41a5 5 0 0 0 7.07 7.07L14 18.07" />
        </svg>
      </ToolbarButton>
      <Divider />
      <label
        title="Text color"
        className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
      >
        <span className="h-4 w-4 rounded border border-gray-300 bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500" />
        <input
          type="color"
          className="sr-only"
          onChange={(e) => applyColor(e.target.value)}
          aria-label="Text color"
        />
      </label>
      <ToolbarButton onClick={clearColor} title="Clear text color">
        <span className="text-xs">A×</span>
      </ToolbarButton>
      <Divider />
      <label
        title="Highlight color"
        className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
      >
        <span className="h-4 w-4 rounded border border-gray-300 bg-yellow-200" />
        <input
          type="color"
          className="sr-only"
          defaultValue="#fff59d"
          onChange={(e) => applyHighlight(e.target.value)}
          aria-label="Highlight color"
        />
      </label>
      <ToolbarButton onClick={clearHighlight} title="Clear highlight">
        <span className="text-xs">H×</span>
      </ToolbarButton>
    </div>
  );
}

const RichEditor = forwardRef(function RichEditor(
  { initialJson, initialText, onChange, placeholder }: Props,
  ref: Ref<EditorHandle>,
) {
  // Track whether we've mounted on the client to avoid SSR/hydration issues.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3] },
        }),
        TextStyle,
        Color,
        Highlight.configure({ multicolor: true }),
      ],
      content: initialJson ?? initialText ?? "",
      editorProps: {
        attributes: {
          class:
            "prose-editor min-h-[260px] max-w-none px-4 py-3 text-sm leading-relaxed text-gray-900 focus:outline-none",
          "data-placeholder": placeholder ?? "",
        },
      },
      onUpdate: ({ editor }) => {
        onChange({
          json: editor.getJSON(),
          plainText: editor.getText({ blockSeparator: "\n\n" }),
        });
      },
      immediatelyRender: false,
    },
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      setHtml: (html: string) => {
        if (editor) editor.commands.setContent(html);
      },
      setJson: (json: object) => {
        if (editor)
          editor.commands.setContent(
            json as Parameters<typeof editor.commands.setContent>[0],
          );
      },
      setText: (text: string) => {
        if (!editor) return;
        // Map plain text into paragraphs preserving blank-line separation.
        const paragraphs = text
          .replace(/\r\n/g, "\n")
          .split(/\n\s*\n+/)
          .filter((p) => p.length > 0);
        if (paragraphs.length === 0) {
          editor.commands.setContent("");
          return;
        }
        const doc = {
          type: "doc",
          content: paragraphs.map((p) => ({
            type: "paragraph",
            content: [{ type: "text", text: p }],
          })),
        };
        editor.commands.setContent(
          doc as Parameters<typeof editor.commands.setContent>[0],
        );
      },
      focus: () => {
        if (editor) editor.commands.focus();
      },
    }),
    [editor],
  );

  if (!mounted) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="h-[40px] border-b border-gray-200 bg-gray-50/60" />
        <div className="min-h-[260px] px-4 py-3 text-sm text-gray-400">
          Loading editor…
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
});

export default RichEditor;
