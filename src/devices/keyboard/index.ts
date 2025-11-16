import HID from "node-hid";
import { AbstractController } from "../../core/AbstractController.ts";
import createApplyColorCommand from "./commands/apply-color.ts";

type KeyboardOptions = {
  vendorId: number;
  productId: number;
  usage: number;
  usagePage: number;
} | {
  path: string;
};

export class KeyboardController extends AbstractController {
  public static async open(options: KeyboardOptions) {
    let interfacePath: string;

    if ('path' in options) {
      interfacePath = options.path
    } else {
      const devices = await HID.devicesAsync(options.vendorId, options.productId);
      const foundDevice = devices.find(d => d.usage === options.usage && d.usagePage === options.usagePage);

      if (!foundDevice) {
        throw new Error("Device matching criteria not found")
      }

      if (!foundDevice.path) {
        throw new Error("Path to interface not found")
      }

      interfacePath = foundDevice.path;
    }

    const device = await HID.HIDAsync.open(interfacePath)

    // const statusBuffer = Array.from(await device.getFeatureReport(0x0, 520));
    // console.debug(statusBuffer)
    // const currentBrightness = statusBuffer[9] / 127 * 100;
    // const currentRed = statusBuffer[12];
    // const currentGreen = statusBuffer[13];
    // const currentBlue = statusBuffer[14];

    return new KeyboardController(device, [255, 255, 255], 100);
  }

  private currentColor: [number, number, number];

  private currentBrightness: number;

  private device: HID.HIDAsync;

  private constructor(device: HID.HIDAsync, currentColor: [number, number, number], currentBrightness: number) {
    super();
    this.device = device;
    this.currentColor = currentColor;
    this.currentBrightness = currentBrightness;
  };

  public async setColor(red: number, green: number, blue: number): Promise<void> {
    this.currentColor = [red, green, blue];

    const command = createApplyColorCommand(...this.currentColor, this.currentBrightness);
    await this.report(0x0, command);
  }

  public async setBrightness(value: number): Promise<void> {
    this.currentBrightness = value

    const command = createApplyColorCommand(...this.currentColor, this.currentBrightness)
    await this.report(0x0, command);
  }

  public async turnOff(): Promise<void> {
    const command = createApplyColorCommand(...this.currentColor, 0);

    await this.report(0x0, command)
  }

  public async turnOn(): Promise<void> {
    const command = createApplyColorCommand(...this.currentColor, this.currentBrightness);

    await this.report(0x0, command)
  }

  public async dispose(): Promise<void> {
    await this.device.close();
  }

  private async report(reportId: number, data: number[]) {
    const buffer = Buffer.from([reportId, ...data]);
    await this.device.sendFeatureReport(buffer);
  }
}
