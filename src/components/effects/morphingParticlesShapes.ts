// SVG element definitions for each Lucide icon (viewBox 0 0 24 24)
type SvgElement = [string, Record<string, string>];

const ICON_ELEMENTS: Record<string, SvgElement[]> = {
  ShoppingBag: [
    ['path', { d: 'M16 10a4 4 0 0 1-8 0' }],
    ['path', { d: 'M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z' }],
  ],
  Calendar: [
    ['path', { d: 'M8 2v4' }],
    ['path', { d: 'M16 2v4' }],
    ['rect', { width: '18', height: '18', x: '3', y: '4', rx: '2' }],
    ['path', { d: 'M3 10h18' }],
  ],
  Banknote: [
    ['rect', { width: '20', height: '12', x: '2', y: '6', rx: '2' }],
    ['circle', { cx: '12', cy: '12', r: '2' }],
    ['path', { d: 'M6 12h.01' }],
    ['path', { d: 'M18 12h.01' }],
  ],
  Megaphone: [
    ['path', { d: 'M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z' }],
    ['path', { d: 'M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14' }],
    ['path', { d: 'M8 6v8' }],
  ],
  TrendingUp: [
    ['path', { d: 'M16 7h6v6' }],
    ['path', { d: 'm22 7-8.5 8.5-5-5L2 17' }],
  ],
  Paintbrush: [
    ['path', { d: 'm14.622 17.897-10.68-2.913' }],
    ['path', { d: 'M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z' }],
    ['path', { d: 'M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15' }],
  ],
  Users: [
    ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
    ['path', { d: 'M16 3.128a4 4 0 0 1 0 7.744' }],
    ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
    ['circle', { cx: '9', cy: '7', r: '4' }],
  ],
  Package: [
    ['path', { d: 'M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z' }],
    ['path', { d: 'M12 22V12' }],
    ['path', { d: 'M3.29 7L12 12L20.71 7' }],
  ],
};

export const FEATURE_ICON_KEYS = [
  'ShoppingBag', 'Calendar', 'Banknote', 'Megaphone', 'TrendingUp', 'Paintbrush', 'Users', 'Package',
];

function drawIconStroke(
  ctx: CanvasRenderingContext2D,
  elements: SvgElement[],
  size: number,
): void {
  const scale = size / 24;
  ctx.save();
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'white';
  ctx.fillStyle = 'none';
  ctx.lineWidth = 0.6; // Thin stroke for crisp outline sampling
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (const [type, attrs] of elements) {
    ctx.beginPath();
    if (type === 'path') {
      const path = new Path2D(attrs.d);
      ctx.stroke(path);
    } else if (type === 'rect') {
      const x = parseFloat(attrs.x || '0');
      const y = parseFloat(attrs.y || '0');
      const w = parseFloat(attrs.width);
      const h = parseFloat(attrs.height);
      const rx = parseFloat(attrs.rx || '0');
      if (rx > 0) {
        ctx.moveTo(x + rx, y);
        ctx.lineTo(x + w - rx, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + rx);
        ctx.lineTo(x + w, y + h - rx);
        ctx.quadraticCurveTo(x + w, y + h, x + w - rx, y + h);
        ctx.lineTo(x + rx, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - rx);
        ctx.lineTo(x, y + rx);
        ctx.quadraticCurveTo(x, y, x + rx, y);
        ctx.closePath();
      } else {
        ctx.rect(x, y, w, h);
      }
      ctx.stroke();
    } else if (type === 'line') {
      ctx.moveTo(parseFloat(attrs.x1), parseFloat(attrs.y1));
      ctx.lineTo(parseFloat(attrs.x2), parseFloat(attrs.y2));
      ctx.stroke();
    } else if (type === 'circle') {
      ctx.arc(parseFloat(attrs.cx), parseFloat(attrs.cy), parseFloat(attrs.r), 0, Math.PI * 2);
      ctx.stroke();
    } else if (type === 'polyline') {
      const points = attrs.points.split(/\s+/).map((p: string) => {
        const [x, y] = p.split(',').map(Number);
        return { x, y };
      });
      if (points.length > 0) {
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}

/**
 * Sample points along the OUTLINE of an icon (not filled).
 * Returns normalized [-1, 1] coordinates with organic scatter.
 */
export function sampleOutlinePoints(
  iconKey: string,
  canvasSize: number,
  pointCount: number,
): Float32Array {
  const elements = ICON_ELEMENTS[iconKey];
  if (!elements) return new Float32Array(pointCount * 2);

  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  drawIconStroke(ctx, elements, canvasSize);

  const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
  const strokePixels: Array<[number, number]> = [];

  for (let y = 0; y < canvasSize; y++) {
    for (let x = 0; x < canvasSize; x++) {
      const i = (y * canvasSize + x) * 4;
      if (imageData.data[i] > 80) {
        strokePixels.push([x / canvasSize, y / canvasSize]);
      }
    }
  }

  const result = new Float32Array(pointCount * 2);
  if (strokePixels.length === 0) return result;

  // Shuffle stroke pixels so sampling is spatially uniform (not top-to-bottom)
  for (let i = strokePixels.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [strokePixels[i], strokePixels[j]] = [strokePixels[j], strokePixels[i]];
  }

  for (let i = 0; i < pointCount; i++) {
    const idx = Math.floor((i / pointCount) * strokePixels.length);
    const [x, y] = strokePixels[Math.min(idx, strokePixels.length - 1)];
    // Tight scatter — points stay close to the stroke for defined contours
    const scatter = 0.015 + Math.random() * 0.015;
    result[i * 2] = (x - 0.5) * 2 + (Math.random() - 0.5) * scatter;
    result[i * 2 + 1] = (y - 0.5) * 2 + (Math.random() - 0.5) * scatter;
  }

  return result;
}

export function precomputeAllShapes(
  canvasSize: number,
  pointCount: number,
): Map<string, Float32Array> {
  const shapes = new Map<string, Float32Array>();
  for (const key of FEATURE_ICON_KEYS) {
    shapes.set(key, sampleOutlinePoints(key, canvasSize, pointCount));
  }
  return shapes;
}
