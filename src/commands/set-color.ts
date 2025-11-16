import { Command } from "commander";
import { CliContext } from "../types.ts";

export default (program: Command, ctx: CliContext) => {
  program
    .command("set-color <red> <green> <blue>")
    .action(async (red, green, blue) => {
      const devices = Object.values(ctx.config.devices)
      const normalizedRed = Math.min(Math.max(+red, 0), 255)
      const normalizedGreen = Math.min(Math.max(+green, 0), 255)
      const normalizedBlue = Math.min(Math.max(+blue, 0), 255)

      for (const device of devices) {
        await device.setColor(normalizedRed, normalizedGreen, normalizedBlue);
      }
    })
}
