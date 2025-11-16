import TuyAPI from "tuyapi";
import { AbstractController } from "../../core/AbstractController.ts";

type LampOptions = {
  id: string;
  key: string;
  ip: string;
  version: number;
}

export class LampController extends AbstractController {
  public static async open(options: LampOptions) {
    const device = new TuyAPI(options);
    await device.find();
    await device.connect();

    return new LampController(device, [255, 255, 255], 1);
  }

  private device: TuyAPI;

  private currentColor: [number, number, number];

  private currentBrightness: number;

  private constructor(device: TuyAPI, currentColor: [number, number, number], currentBrightness: number) {
    super();
    this.device = device;
    this.currentColor = currentColor;
    this.currentBrightness = currentBrightness;
  }

  public async setColor(red: number, green: number, blue: number): Promise<void> {
    this.currentColor = [red, green, blue];

    const { h, s, v } = rgbToHsv(red, green, blue);
    const hsvString = encodeTuyaHSV(h, s, v);

    await this.device.set({ dps: 24, set: hsvString });
  }

  public async setBrightness(percent: number): Promise<void> {
    this.currentBrightness = percent;

    const { h, s } = rgbToHsv(...this.currentColor);
    const hsvString = encodeTuyaHSV(h, s, percent);

    await this.device.set({ dps: 24, set: hsvString });
  }

  public async turnOff(): Promise<void> {
    await this.device.set({ dps: 20, set: false })
  }

  public async turnOn(): Promise<void> {
    await this.device.set({ dps: 20, set: true })
  }

  public async dispose(): Promise<void> {
    this.device.disconnect()
  }
}

function rgbToHsv(r: number, g: number, b: number) {
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

function encodeTuyaHSV(h: number, s: number, v: number) {
  const hVal = Math.max(0, Math.min(360, Math.round(h)));
  const sVal = Math.max(0, Math.min(1000, Math.round(s * 1000)));
  const vVal = Math.max(0, Math.min(1000, Math.round(v * 1000)));

  const hHex = hVal.toString(16).padStart(4, '0');
  const sHex = sVal.toString(16).padStart(4, '0');
  const vHex = vVal.toString(16).padStart(4, '0');

  return `${hHex}${sHex}${vHex}`;
}
