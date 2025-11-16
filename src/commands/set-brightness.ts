import { Command } from "commander";
import { CliContext } from "../types.ts";

export default (program: Command, ctx: CliContext) => {
  program
    .command("set-brightness <brightness>")
    .action(async (brightness) => {
      const devices = Object.values(ctx.config.devices)
      const normalizedBrightness = Math.min(Math.max(+brightness, 0), 100)

      for (const device of devices) {
        await device.setBrightness(normalizedBrightness);
      }
    })
}
