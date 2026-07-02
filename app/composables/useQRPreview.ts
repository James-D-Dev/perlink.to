import QRDot from "@/plugins/QRCodeVue3/core/QRDot";
import QRCornerSquare from "@/plugins/QRCodeVue3/core/QRCornerSquare";
import QRCornerDot from "@/plugins/QRCodeVue3/core/QRCornerDot";
import dotTypes from "@/plugins/QRCodeVue3/constants/dotTypes";
import cornerSquareTypes from "@/plugins/QRCodeVue3/constants/cornerSquareTypes";
import cornerDotTypes from "@/plugins/QRCodeVue3/constants/cornerDotTypes";
import type { DotType, CornerSquareType, CornerDotType } from "@/plugins/QRCodeVue3/types";

/**
 * QR Pattern Template (8x8 grid)
 * 1 = dot, 0 = empty
 * Shows realistic QR module arrangements
 */
const QR_PATTERN_TEMPLATE = [
  [1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 1],
  [0, 1, 0, 1, 0, 0, 0, 1],
];

/**
 * Generate Canvas-based preview for dot patterns
 * Uses actual QRDot drawing logic from QRCodeVue3
 * Renders realistic QR pattern template
 */
export function generateDotPatternPreview(
  type: string,
  size: number = 64
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Map type string to dotTypes constant
  const dotType =
    (Object.values(dotTypes).find((t) => t === type) as keyof typeof dotTypes) || dotTypes.square;

  const qrDot = new QRDot({ context: ctx, type: dotType as DotType });

  const rows = QR_PATTERN_TEMPLATE.length;
  const cols = QR_PATTERN_TEMPLATE[0]?.length || 8;
  const cellSize = size / Math.max(rows, cols);

  ctx.fillStyle = "#374151"; // gray-700

  // Pre-scan to identify all dot positions for neighbor detection
  const hasDotAt = (row: number, col: number): boolean => {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false;
    return QR_PATTERN_TEMPLATE[row]?.[col] === 1;
  };

  // Draw each dot with proper neighbor detection
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!hasDotAt(row, col)) continue;

      const x = col * cellSize + cellSize / 2;
      const y = row * cellSize + cellSize / 2;

      // Neighbor function for this dot
      const getNeighbor = (dx: number, dy: number): boolean => {
        return hasDotAt(row + dy, col + dx);
      };

      ctx.beginPath();
      qrDot.draw(x, y, cellSize * 0.98, getNeighbor);
      ctx.fill();
    }
  }

  return canvas.toDataURL("image/png");
}

/**
 * Generate Canvas-based preview for corner squares
 */
export function generateCornerSquarePreview(
  type: string,
  size: number = 40
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Map type string
  const cornerType =
    (Object.values(cornerSquareTypes).find((t) => t === type) as keyof typeof cornerSquareTypes) ||
    cornerSquareTypes.square;

  const cornerSquare = new QRCornerSquare({
    context: ctx,
    type: cornerType as CornerSquareType,
  });

  ctx.strokeStyle = "#374151";
  ctx.fillStyle = "#374151";

  // Draw corner square at center
  ctx.beginPath();
  cornerSquare.draw(size / 2, size / 2, size * 0.8, 0);
  ctx.fill();

  return canvas.toDataURL("image/png");
}

/**
 * Generate Canvas-based preview for corner dots
 */
export function generateCornerDotPreview(
  type: string,
  size: number = 40
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Map type string
  const dotType =
    (Object.values(cornerDotTypes).find((t) => t === type) as keyof typeof cornerDotTypes) ||
    cornerDotTypes.square;

  const cornerDot = new QRCornerDot({ context: ctx, type: dotType as CornerDotType });

  ctx.strokeStyle = "#374151";
  ctx.fillStyle = "#374151";

  // Draw corner dot at center
  ctx.beginPath();
  cornerDot.draw(size / 2, size / 2, size * 0.5, 0);
  ctx.fill();

  return canvas.toDataURL("image/png");
}

/**
 * Generate SVG string preview for dot patterns (fallback for SSR)
 */
export function generateDotPatternSVG(type: string): string {
  const svgSize = 32;
  const cellSize = svgSize / 3;

  // Simplified SVG paths for each dot type
  const paths: Record<string, string> = {
    'square': `
      <rect x="${cellSize * 0.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" fill="currentColor"/>
      <rect x="${cellSize * 1.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" fill="currentColor"/>
      <rect x="${cellSize * 0.1}" y="${cellSize * 1.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" fill="currentColor"/>
      <rect x="${cellSize * 0.6}" y="${cellSize * 0.6}" width="${
      cellSize * 0.4
    }" height="${cellSize * 0.4}" fill="currentColor"/>
    `,
    'rounded': `
      <rect x="${cellSize * 0.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.2}" fill="currentColor"/>
      <rect x="${cellSize * 1.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.2}" fill="currentColor"/>
      <rect x="${cellSize * 0.1}" y="${cellSize * 1.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.2}" fill="currentColor"/>
      <rect x="${cellSize * 0.6}" y="${cellSize * 0.6}" width="${
      cellSize * 0.4
    }" height="${cellSize * 0.4}" rx="${cellSize * 0.1}" fill="currentColor"/>
    `,
    'dots': `
      <circle cx="${cellSize * 0.5}" cy="${cellSize * 0.5}" r="${
      cellSize * 0.3
    }" fill="currentColor"/>
      <circle cx="${cellSize * 1.5}" cy="${cellSize * 0.5}" r="${
      cellSize * 0.3
    }" fill="currentColor"/>
      <circle cx="${cellSize * 0.5}" cy="${cellSize * 1.5}" r="${
      cellSize * 0.3
    }" fill="currentColor"/>
      <circle cx="${cellSize * 0.8}" cy="${cellSize * 0.8}" r="${
      cellSize * 0.2
    }" fill="currentColor"/>
    `,
    'classy': `
      <rect x="${cellSize * 0.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.1}" fill="currentColor"/>
      <rect x="${cellSize * 1.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.1}" fill="currentColor"/>
      <rect x="${cellSize * 0.1}" y="${cellSize * 1.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.1}" fill="currentColor"/>
      <circle cx="${cellSize * 0.8}" cy="${cellSize * 0.8}" r="${
      cellSize * 0.2
    }" fill="currentColor"/>
    `,
    'classy-rounded': `
      <rect x="${cellSize * 0.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.3}" fill="currentColor"/>
      <rect x="${cellSize * 1.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.3}" fill="currentColor"/>
      <rect x="${cellSize * 0.1}" y="${cellSize * 1.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.3}" fill="currentColor"/>
      <circle cx="${cellSize * 0.8}" cy="${cellSize * 0.8}" r="${
      cellSize * 0.2
    }" fill="currentColor"/>
    `,
    'extra-rounded': `
      <rect x="${cellSize * 0.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.4}" fill="currentColor"/>
      <rect x="${cellSize * 1.1}" y="${cellSize * 0.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.4}" fill="currentColor"/>
      <rect x="${cellSize * 0.1}" y="${cellSize * 1.1}" width="${
      cellSize * 0.8
    }" height="${cellSize * 0.8}" rx="${cellSize * 0.4}" fill="currentColor"/>
      <rect x="${cellSize * 0.6}" y="${cellSize * 0.6}" width="${
      cellSize * 0.4
    }" height="${cellSize * 0.4}" rx="${cellSize * 0.2}" fill="currentColor"/>
    `,
  };

  const content = paths[type] || paths['square'];

  return `<svg viewBox="0 0 ${svgSize} ${svgSize}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block;">${content}</svg>`;
}

/**
 * Generate SVG string preview for corner squares
 */
export function generateCornerSquareSVG(type: string): string {
  const size = 16;
  const center = size / 2;
  const outerSize = size * 0.75;
  const innerSize = outerSize * 0.4;

  const paths: Record<string, string> = {
    'square': `
      <rect x="${center - outerSize / 2}" y="${
      center - outerSize / 2
    }" width="${outerSize}" height="${outerSize}" fill="none" stroke="currentColor" stroke-width="2"/>
      <rect x="${center - innerSize / 2}" y="${
      center - innerSize / 2
    }" width="${innerSize}" height="${innerSize}" fill="currentColor"/>
    `,
    'dot': `
      <circle cx="${center}" cy="${center}" r="${outerSize / 2}" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="${center}" cy="${center}" r="${innerSize / 2}" fill="currentColor"/>
    `,
    'extra-rounded': `
      <rect x="${center - outerSize / 2}" y="${
      center - outerSize / 2
    }" width="${outerSize}" height="${outerSize}" rx="${outerSize / 3}" fill="none" stroke="currentColor" stroke-width="2"/>
      <circle cx="${center}" cy="${center}" r="${innerSize / 2}" fill="currentColor"/>
    `,
  };

  const content = paths[type] || paths['square'];

  return `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style="display:block;">${content}</svg>`;
}

/**
 * Composable for reactive QR preview generation
 */
export function useQRPreview() {
  // Client-side only canvas generation
  const getDotPreview = (type: string) => {
    if (process.client) {
      return generateDotPatternPreview(type);
    }
    return "";
  };

  const getCornerSquarePreview = (type: string) => {
    if (process.client) {
      return generateCornerSquarePreview(type);
    }
    return "";
  };

  const getCornerDotPreview = (type: string) => {
    if (process.client) {
      return generateCornerDotPreview(type);
    }
    return "";
  };

  return {
    generateDotPatternSVG,
    generateCornerSquareSVG,
    generateDotPatternPreview: getDotPreview,
    generateCornerSquarePreview: getCornerSquarePreview,
    generateCornerDotPreview: getCornerDotPreview,
  };
}
