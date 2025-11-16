import TuyAPI, { DPSObject } from "tuyapi";
import { AbstractController } from "../../core/AbstractController.ts";
import { encodeTuyaHSV, rgbToHsv, tuyaHSVToRgbAndBrightness } from "./helpers.ts";

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

    const { dps } = await device.get({ schema: true }) as DPSObject;
    const hsvString = dps["24"] as string;

    const { r, g, b, brightness } = tuyaHSVToRgbAndBrightness(hsvString)

    return new LampController(device, [r, g, b], brightness);
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
