import type { AutoTyper } from "..";
import { Event } from "./event";

export class TypeEvent extends Event {
  public config: TypeEventConfigInterface;

  constructor(autoTyper: AutoTyper, config: TypeEventConfigInterface = {}) {
    super(autoTyper, true, "type");
    config = {
      toType: "nothing defined",
      timeBetweenLetter: autoTyper.config.delay,
      ...config,
    };
    this.config = config;
  }

  public async execute(): Promise<void> {
    const autoTyper = this.autoTyper();
    const lettersToType = this.config.toType?.split("") ?? [];

    return new Promise((resolve) => {
      autoTyper.interval(() => {
        const char = lettersToType.shift();
        if (char) {
          autoTyper.setText(`${autoTyper.text}${char}`);
          return;
        }

        autoTyper.clearInterval();
        resolve(undefined);
      }, this.config.timeBetweenLetter);
    });
  }
}

export interface TypeEventConfigInterface {
  toType?: string;
  timeBetweenLetter?: number;
}
