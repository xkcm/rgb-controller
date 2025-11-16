import { defineConfig } from "./core/ConfigInterface.ts";
import { KeyboardController } from "./devices/keyboard/index.ts";
import { LampController } from "./devices/lamp/index.ts";

export default defineConfig(async (env) => ({
  devices: {
    keyboard: await KeyboardController.open({
      productId: +env.KEYBOARD_PRODUCT_ID,
      vendorId: +env.KEYBOARD_VENDOR_ID,
      usage: +env.KEYBOARD_USAGE,
      usagePage: +env.KEYBOARD_USAGE_PAGE
    }),
    lamp: await LampController.open({
      id: env.LAMP_ID,
      key: env.LAMP_KEY,
      ip: env.LAMP_IP,
      version: +env.LAMP_VERSION
    })
  }
}))
