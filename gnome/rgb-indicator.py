#!/usr/bin/env python3
import subprocess
from pathlib import Path

from gi.repository import AppIndicator3, Gtk

APPINDICATOR_ID = 'rgb-indicator'

CLI_PATH = str(Path(__file__).parent / ".." / "src" / "cli.ts")
ENV_PATH = str(Path(__file__).parent / ".." / ".env")

class LampIndicator:
    def __init__(self):
        self.indicator = AppIndicator3.Indicator.new(
            APPINDICATOR_ID,
            "color-select",
            AppIndicator3.IndicatorCategory.APPLICATION_STATUS
        )
        self.indicator.set_status(AppIndicator3.IndicatorStatus.ACTIVE)

        menu = Gtk.Menu()

        item_color = Gtk.MenuItem(label="Pick color")
        item_color.connect("activate", self.on_set_color)
        menu.append(item_color)

        item_on = Gtk.MenuItem(label="Turn on")
        item_on.connect("activate", self.on_turn_on)
        menu.append(item_on)

        item_off = Gtk.MenuItem(label="Turn off")
        item_off.connect("activate", self.on_turn_off)
        menu.append(item_off)

        item_quit = Gtk.MenuItem(label="Quit")
        item_quit.connect("activate", self.on_quit)
        menu.append(item_quit)

        menu.show_all()
        self.indicator.set_menu(menu)

    def run_cli(self, *args):
        cmd = ["/home/xkcm/.bun/bin/bun", CLI_PATH, "--env-file", ENV_PATH, *map(str, args)]
        print("Running:", " ".join(cmd))
        subprocess.Popen(cmd)

    def on_turn_on(self, _menuitem):
        self.run_cli("turn-on")

    def on_turn_off(self, _menuitem):
        self.run_cli("turn-off")

    def on_set_color(self, _menuitem):
        dialog = Gtk.ColorChooserDialog(title="Pick color", parent=None)
        dialog.set_use_alpha(False)

        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            rgba = dialog.get_rgba()
            r = int(rgba.red * 255)
            g = int(rgba.green * 255)
            b = int(rgba.blue * 255)
            print(f"Selected color: {r}, {g}, {b}")
            self.run_cli("set-color", r, g, b)

        dialog.destroy()

    def on_quit(self, _menuitem):
        Gtk.main_quit()


def main():
    LampIndicator()
    Gtk.main()


if __name__ == "__main__":
    main()
