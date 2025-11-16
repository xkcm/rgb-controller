export abstract class AbstractController {
  public abstract setColor(red: number, green: number, blue: number): Promise<void>;

  public abstract setBrightness(value: number): Promise<void>;

  public abstract turnOff(): Promise<void>;

  public abstract turnOn(): Promise<void>;

  public abstract dispose(): Promise<void>;
}
