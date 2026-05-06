// Translates internal Block units into Google Docs API request objects.
// Used by the format-aware export loop in app/scheduler.tsx.

import type { Block, Mark } from "./doc-model";

// We don't pull in the full googleapis types here (the client posts plain
// JSON to /api/google-docs/batch); this is a structural shape that matches
// what Google Docs' batchUpdate accepts.
export type GDocsRequest = Record<string, unknown>;

const HEADING_NAMED_STYLES = [
  "HEADING_1",
  "HEADING_2",
  "HEADING_3",
  "HEADING_4",
  "HEADING_5",
  "HEADING_6",
] as const;

function hexToRgbColor(
  hex: string,
): { red: number; green: number; blue: number } | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6})$/i);
  if (!m) {
    // Try shorthand #abc
    const short = hex.replace("#", "").match(/^([0-9a-f]{3})$/i);
    if (!short) return null;
    const c = short[1];
    const expanded = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    return hexToRgbColor("#" + expanded);
  }
  const num = parseInt(m[1], 16);
  return {
    red: ((num >> 16) & 0xff) / 255,
    green: ((num >> 8) & 0xff) / 255,
    blue: (num & 0xff) / 255,
  };
}

function markToTextStyleRequest(
  mark: Mark,
  startIndex: number,
  endIndex: number,
): GDocsRequest | null {
  if (endIndex <= startIndex) return null;
  const range = { startIndex, endIndex };
  switch (mark.type) {
    case "bold":
      return {
        updateTextStyle: {
          range,
          textStyle: { bold: true },
          fields: "bold",
        },
      };
    case "italic":
      return {
        updateTextStyle: {
          range,
          textStyle: { italic: true },
          fields: "italic",
        },
      };
    case "underline":
      return {
        updateTextStyle: {
          range,
          textStyle: { underline: true },
          fields: "underline",
        },
      };
    case "link":
      return {
        updateTextStyle: {
          range,
          textStyle: { link: { url: mark.href } },
          fields: "link",
        },
      };
    case "color": {
      const rgb = hexToRgbColor(mark.color);
      if (!rgb) return null;
      return {
        updateTextStyle: {
          range,
          textStyle: { foregroundColor: { color: { rgbColor: rgb } } },
          fields: "foregroundColor",
        },
      };
    }
    case "highlight": {
      const rgb = hexToRgbColor(mark.color);
      if (!rgb) return null;
      return {
        updateTextStyle: {
          range,
          textStyle: { backgroundColor: { color: { rgbColor: rgb } } },
          fields: "backgroundColor",
        },
      };
    }
    default:
      return null;
  }
}

// Result of preparing a single block for the export pipeline.
export type BlockExport = {
  // Text to insert (always ends with a single "\n" so the next block lands
  // on a new paragraph in Google Docs).
  insertText: string;
  // Style operations to apply AFTER the text is inserted at `baseIndex`.
  // The caller is responsible for tracking baseIndex via an in-memory mirror.
  buildStyleRequests: (baseIndex: number) => GDocsRequest[];
};

export function prepareBlockExport(block: Block): BlockExport {
  const insertText = block.text + "\n";

  const buildStyleRequests = (baseIndex: number): GDocsRequest[] => {
    const requests: GDocsRequest[] = [];
    // Inline marks
    for (const span of block.marks) {
      const start = baseIndex + span.start;
      const end = baseIndex + span.end;
      for (const mark of span.marks) {
        const req = markToTextStyleRequest(mark, start, end);
        if (req) requests.push(req);
      }
    }
    // Block-level styles
    if (block.type === "heading") {
      const named =
        HEADING_NAMED_STYLES[Math.min(5, Math.max(0, block.level - 1))];
      requests.push({
        updateParagraphStyle: {
          range: {
            startIndex: baseIndex,
            endIndex: baseIndex + insertText.length,
          },
          paragraphStyle: { namedStyleType: named },
          fields: "namedStyleType",
        },
      });
    }
    // Note: list bullets are applied at the LIST level (across consecutive
    // list-item blocks). The export loop in scheduler.tsx handles that
    // separately via buildBulletsRequest.
    return requests;
  };

  return { insertText, buildStyleRequests };
}

// Build a single createParagraphBullets request that turns a contiguous range
// of inserted paragraphs into bullets/numbers in the doc.
export function buildBulletsRequest(
  ordering: "bullet" | "ordered",
  startIndex: number,
  endIndex: number,
): GDocsRequest {
  return {
    createParagraphBullets: {
      range: { startIndex, endIndex },
      bulletPreset:
        ordering === "bullet"
          ? "BULLET_DISC_CIRCLE_SQUARE"
          : "NUMBERED_DECIMAL_ALPHA_ROMAN",
    },
  };
}
