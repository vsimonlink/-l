import sharp from "sharp";
import path from "path";

export type Orientation = "portrait" | "landscape" | "square";

export interface ImageFormatInfo {
  format: string;
  category: "web" | "raw" | "other";
  mimeType?: string;
}

export interface ImageMeta {
  orientation: Orientation;
  width: number;
  height: number;
  format: ImageFormatInfo;
}

const RAW_EXTENSIONS: Record<string, { format: string; mimeType: string }> = {
  ".nef": { format: "NEF (尼康 RAW)", mimeType: "image/x-nikon-nef" },
  ".nrw": { format: "NRW (尼康 RAW)", mimeType: "image/x-nikon-nrw" },
  ".cr2": { format: "CR2 (佳能 RAW)", mimeType: "image/x-canon-cr2" },
  ".cr3": { format: "CR3 (佳能 RAW)", mimeType: "image/x-canon-cr3" },
  ".arw": { format: "ARW (索尼 RAW)", mimeType: "image/x-sony-arw" },
  ".srf": { format: "SRF (索尼 RAW)", mimeType: "image/x-sony-srf" },
  ".sr2": { format: "SR2 (索尼 RAW)", mimeType: "image/x-sony-sr2" },
  ".dng": { format: "DNG (通用 RAW)", mimeType: "image/x-adobe-dng" },
  ".raf": { format: "RAF (富士 RAW)", mimeType: "image/x-fuji-raf" },
  ".orf": { format: "ORF (奥林巴斯 RAW)", mimeType: "image/x-olympus-orf" },
  ".ori": { format: "ORI (奥林巴斯 RAW)", mimeType: "image/x-olympus-ori" },
  ".rw2": { format: "RW2 (松下 RAW)", mimeType: "image/x-panasonic-rw2" },
  ".rwl": { format: "RWL (徕卡 RAW)", mimeType: "image/x-leica-rwl" },
  ".pef": { format: "PEF (宾得 RAW)", mimeType: "image/x-pentax-pef" },
  ".srw": { format: "SRW (三星 RAW)", mimeType: "image/x-samsung-srw" },
  ".x3f": { format: "X3F (适马 RAW)", mimeType: "image/x-sigma-x3f" },
  ".erf": { format: "ERF (爱普生 RAW)", mimeType: "image/x-epson-erf" },
  ".mef": { format: "MEF (玛米亚 RAW)", mimeType: "image/x-mamiya-mef" },
  ".mos": { format: "MOS (利图 RAW)", mimeType: "image/x-leaf-mos" },
  ".kdc": { format: "KDC (柯达 RAW)", mimeType: "image/x-kodak-kdc" },
  ".dcr": { format: "DCR (柯达 RAW)", mimeType: "image/x-kodak-dcr" },
};

function detectFormatByExtension(filePath: string): ImageFormatInfo | null {
  const ext = path.extname(filePath).toLowerCase();
  const raw = RAW_EXTENSIONS[ext];
  if (raw) return { ...raw, category: "raw" };
  return null;
}

function sharpFormatToInfo(format: string): ImageFormatInfo {
  const map: Record<string, ImageFormatInfo> = {
    jpeg: { format: "JPEG", category: "web", mimeType: "image/jpeg" },
    png: { format: "PNG", category: "web", mimeType: "image/png" },
    webp: { format: "WebP", category: "web", mimeType: "image/webp" },
    avif: { format: "AVIF", category: "web", mimeType: "image/avif" },
    gif: { format: "GIF", category: "web", mimeType: "image/gif" },
    svg: { format: "SVG", category: "web", mimeType: "image/svg+xml" },
    tiff: { format: "TIFF", category: "web", mimeType: "image/tiff" },
    heif: { format: "HEIC/HEIF", category: "other", mimeType: "image/heif" },
    pdf: { format: "PDF", category: "other", mimeType: "application/pdf" },
  };
  return map[format] ?? { format: format.toUpperCase(), category: "other" };
}

function getOrientation(width: number, height: number): Orientation {
  const ratio = width / height;
  if (ratio > 1.05) return "landscape";
  if (ratio < 0.95) return "portrait";
  return "square";
}

export async function getImageMeta(filePath: string): Promise<ImageMeta> {
  try {
    const meta = await sharp(filePath).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const fmt = meta.format
      ? sharpFormatToInfo(meta.format)
      : detectFormatByExtension(filePath) ?? { format: "UNKNOWN", category: "other" as const };

    return {
      orientation: getOrientation(width, height),
      width,
      height,
      format: fmt,
    };
  } catch {
    // sharp 无法解析（RAW 格式等），用扩展名兜底
    const extFormat = detectFormatByExtension(filePath) ?? {
      format: path.extname(filePath).toUpperCase().slice(1) || "UNKNOWN",
      category: "other" as const,
    };
    return {
      orientation: "landscape", // 无法确定时默认横屏
      width: 0,
      height: 0,
      format: extFormat,
    };
  }
}

export function isPortrait(orientation: Orientation): boolean {
  return orientation === "portrait";
}

export function isLandscape(orientation: Orientation): boolean {
  return orientation === "landscape";
}

export function isRawFormat(format: ImageFormatInfo): boolean {
  return format.category === "raw";
}
