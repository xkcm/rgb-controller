export function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h: number;

  if (d === 0) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) / d) % 6;
  } else if (max === g) {
    h = (b - r) / d + 2;
  } else {
    h = (r - g) / d + 4;
  }

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  const s = max === 0 ? 0 : d / max;
  const v = max;

  return { h, s, v };
}

export function tuyaHSVToRgbAndBrightness(hsvHex: string) {
  if (!hsvHex || hsvHex.length !== 12) {
    throw new Error('Incorrect Tuya HSV (expected 12 hex chars).');
  }

  const hHex = hsvHex.slice(0, 4);
  const sHex = hsvHex.slice(4, 8);
  const vHex = hsvHex.slice(8, 12);

  const h = parseInt(hHex, 16);
  const s1000 = parseInt(sHex, 16);
  const v1000 = parseInt(vHex, 16);

  const s = s1000 / 1000;
  const v = v1000 / 1000;

  const brightness = Math.round(v * 100);

  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let rp: number, gp: number, bp: number;
  if (0 <= h && h < 60) {
    [rp, gp, bp] = [c, x, 0];
  } else if (60 <= h && h < 120) {
    [rp, gp, bp] = [x, c, 0];
  } else if (120 <= h && h < 180) {
    [rp, gp, bp] = [0, c, x];
  } else if (180 <= h && h < 240) {
    [rp, gp, bp] = [0, x, c];
  } else if (240 <= h && h < 300) {
    [rp, gp, bp] = [x, 0, c];
  } else {
    [rp, gp, bp] = [c, 0, x];
  }

  const r = Math.round((rp + m) * 255);
  const g = Math.round((gp + m) * 255);
  const b = Math.round((bp + m) * 255);

  return { r, g, b, brightness };
}

export function encodeTuyaHSV(h: number, s: number, v: number) {
  const hVal = Math.max(0, Math.min(360, Math.round(h)));
  const sVal = Math.max(0, Math.min(1000, Math.round(s * 1000)));
  const vVal = Math.max(0, Math.min(1000, Math.round(v * 1000)));

  const hHex = hVal.toString(16).padStart(4, '0');
  const sHex = sVal.toString(16).padStart(4, '0');
  const vHex = vVal.toString(16).padStart(4, '0');

  return `${hHex}${sHex}${vHex}`;
}
