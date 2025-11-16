import { Command } from "commander";
import setupSetColorCommand from "./commands/set-color.ts";
// import setupSetBrightnessCommand from "./commands/set-brightness.ts";
import setupTurnOffCommand from "./commands/turn-off.ts";
import setupTurnOnCommand from "./commands/turn-on.ts";
import createConfig from "./config.ts";
import "./preload-env.ts";

const commands = [
  setupSetColorCommand,
  // setupSetBrightnessCommand,
  setupTurnOnCommand,
  setupTurnOffCommand
]
const program = new Command();
const config = await createConfig(process.env as Record<string, string>);

program
  .name("rgb-controller")
  .description("CLI tool for controlling RGB lights")
  .version("1.0.0")
  .requiredOption("--env-file <path>", "Path to the environment file")
  .hook('postAction', async () => {
    for (const device of Object.values(config.devices)) {
      await device.dispose()
    }
  });


for (const setupCommand of commands) {
  setupCommand(program, { config })
}

program.parse()
