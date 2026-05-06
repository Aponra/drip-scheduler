// Internal document model used by the format-aware Google Docs export and by
// the plain-text projection (for chunking / scheduling estimates / saved
// schedule fallbacks). TipTap JSON is the canonical storage format; this
// module converts it to and from a flat list of "drip blocks".

export type Mark =
  | { type: "bold" }
  | { type: "italic" }
  | { type: "underline" }
  | { type: "link"; href: string }
  | { type: "color"; color: string }
  | { type: "highlight"; color: string };

export type MarkSpan = {
  start: number; // inclusive offset within the block's text
  end: number; // exclusive offset within the block's text
  marks: Mark[];
};

export type Block =
  | { type: "paragraph"; text: string; marks: MarkSpan[] }
  | {
      type: "heading";
      level: 1 | 2 | 3 | 4 | 5 | 6;
      text: string;
      marks: MarkSpan[];
    }
  | {
      type: "list-item";
      ordering: "bullet" | "ordered";
      text: string;
      marks: MarkSpan[];
    };

// ─────────────────────────────────────────────────────────────────────────────
// TipTap JSON ──> Blocks
// ─────────────────────────────────────────────────────────────────────────────

type TipTapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
};

export function documentToBlocks(doc: unknown): Block[] {
  const root = (doc as TipTapNode | null | undefined)?.content ?? [];
  const blocks: Block[] = [];
  for (const node of root) walkBlockNode(node, blocks);
  return blocks;
}

function walkBlockNode(node: TipTapNode, out: Block[]): void {
  if (!node || typeof node.type !== "string") return;
  switch (node.type) {
    case "paragraph": {
      const { text, marks } = extractInline(node.content ?? []);
      out.push({ type: "paragraph", text, marks });
      return;
    }
    case "heading": {
      const lvlRaw = (node.attrs as { level?: number } | undefined)?.level ?? 1;
      const level = (Math.min(6, Math.max(1, lvlRaw)) as Block extends {
        type: "heading";
        level: infer L;
      }
        ? L
        : never);
      const { text, marks } = extractInline(node.content ?? []);
      out.push({ type: "heading", level, text, marks });
      return;
    }
    case "bulletList":
    case "orderedList": {
      const ordering = node.type === "bulletList" ? "bullet" : "ordered";
      for (const item of node.content ?? []) {
        // listItem may contain paragraphs and possibly nested lists. Flatten.
        for (const inner of item.content ?? []) {
          if (inner.type === "paragraph") {
            const { text, marks } = extractInline(inner.content ?? []);
            out.push({ type: "list-item", ordering, text, marks });
          } else {
            // Nested lists / blockquotes inside a list item are uncommon in
            // our toolbar; fall through to default.
            walkBlockNode(inner, out);
          }
        }
      }
      return;
    }
    case "blockquote": {
      // Treat a blockquote as a paragraph containing its concatenated children.
      const subs: Block[] = [];
      for (const child of node.content ?? []) walkBlockNode(child, subs);
      for (const sub of subs) out.push(sub);
      return;
    }
    case "horizontalRule": {
      out.push({ type: "paragraph", text: "", marks: [] });
      return;
    }
    default: {
      // Unknown block types: try to pull any plain text content.
      const { text, marks } = extractInline(node.content ?? []);
      if (text.length > 0) out.push({ type: "paragraph", text, marks });
      return;
    }
  }
}

function extractInline(content: TipTapNode[]): {
  text: string;
  marks: MarkSpan[];
} {
  let text = "";
  const marks: MarkSpan[] = [];
  for (const node of content) {
    if (node.type === "text") {
      const piece = node.text ?? "";
      const start = text.length;
      text += piece;
      const end = text.length;
      const m: Mark[] = [];
      for (const raw of node.marks ?? []) {
        const mapped = mapMark(raw);
        if (mapped) m.push(mapped);
      }
      if (m.length > 0 && end > start) marks.push({ start, end, marks: m });
    } else if (node.type === "hardBreak") {
      text += "\n";
    } else if (node.content) {
      const inner = extractInline(node.content);
      const offset = text.length;
      text += inner.text;
      for (const span of inner.marks) {
        marks.push({
          start: span.start + offset,
          end: span.end + offset,
          marks: span.marks,
        });
      }
    }
  }
  return { text, marks };
}

function mapMark(
  raw: { type: string; attrs?: Record<string, unknown> } | undefined,
): Mark | null {
  if (!raw) return null;
  switch (raw.type) {
    case "bold":
      return { type: "bold" };
    case "italic":
      return { type: "italic" };
    case "underline":
      return { type: "underline" };
    case "link": {
      const href =
        typeof raw.attrs?.href === "string" ? (raw.attrs.href as string) : null;
      return href ? { type: "link", href } : null;
    }
    case "textStyle": {
      const color =
        typeof raw.attrs?.color === "string"
          ? (raw.attrs.color as string)
          : null;
      return color ? { type: "color", color } : null;
    }
    case "highlight": {
      const color =
        typeof raw.attrs?.color === "string"
          ? (raw.attrs.color as string)
          : null;
      // If no color attr is present, pick a sane default highlight color so
      // the doc still ends up styled.
      return { type: "highlight", color: color ?? "#fff59d" };
    }
    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Plain text projection (for chunking, save-fallback, scheduling estimates)
// ─────────────────────────────────────────────────────────────────────────────

export function documentToPlainText(doc: unknown): string {
  const blocks = documentToBlocks(doc);
  if (blocks.length === 0) return "";
  // Paragraphs and headings get blank-line separators; consecutive list items
  // get single newlines so they read as a list.
  const lines: string[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const next = blocks[i + 1];
    lines.push(b.text);
    if (!next) continue;
    const bothListItems =
      b.type === "list-item" &&
      next.type === "list-item" &&
      b.ordering === next.ordering;
    lines.push(bothListItems ? "\n" : "\n\n");
  }
  return lines.join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// Plain text ──> TipTap JSON (for backward compat when loading old saves
// that only have originalText)
// ─────────────────────────────────────────────────────────────────────────────

export function plainTextToDocument(text: string): object {
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n+/)
    .filter((p) => p.length > 0);
  if (paragraphs.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }
  return {
    type: "doc",
    content: paragraphs.map((p) => ({
      type: "paragraph",
      content: [{ type: "text", text: p }],
    })),
  };
}
