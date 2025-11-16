import { Command } from "commander";
import { CliContext } from "../types.ts";

export default (program: Command, ctx: CliContext) => {
  program
    .command("turn-on")
    .action(async () => {
      const devices = Object.values(ctx.config.devices)

      for (const device of devices) {
        await device.turnOn();
      }
    })
}
