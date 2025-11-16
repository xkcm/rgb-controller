import { AbstractController } from "./AbstractController.ts"

export type CliConfig = {
  devices: Record<string, AbstractController>
}

export const defineConfig = (configFactory: (env: Record<string, string>) => Promise<CliConfig>) => configFactory
