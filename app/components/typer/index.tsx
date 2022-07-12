import React, { useEffect, useState } from "react";
import type { Event } from "./events/event";
import type { RemoveEventConfigInterface } from "./events/remove-event";
import type { TypeEventConfigInterface } from "./events/type-event";
import type { SleepEventConfigInterface } from "./events/sleep-event";
import type { LoopEventConfigInterface } from "./events/loop-event";
import { RemoveEvent } from "./events/remove-event";
import { TypeEvent } from "./events/type-event";
import { SleepEvent } from "./events/sleep-event";
import { LoopEvent } from "./events/loop-event";

export class AutoTyper {
  public activeTimeout?: NodeJS.Timeout | number;
  private activeInterval?: NodeJS.Timer | number;
  public config: AutoTyperConfigInterface;

  public queue: Event[];
  public executedQueue: Event[];

  public textListener: TextListenerType;
  public text: string;

  public isTyping: boolean;
  public isTypingListener: IsTypingListenerType;

  public isActive: boolean;

  constructor(config: CreateAutoTyperConfigInterface = {}) {
    const _config = {
      initialText: "",
      delay: 200,
      textListener: () => {},
      isTypingListener: () => {},
      ...config,
    };
    this.config = {
      initialText: _config.initialText,
      delay: _config.delay,
    };
    this.text = _config.initialText;
    this.textListener = _config.textListener;
    this.isTypingListener = _config.isTypingListener;
    this.queue = [];
    this.executedQueue = [];
    this.isTyping = false;
    this.isActive = false;

    this.textListener(this.text);
    this.isTypingListener(this.isTyping);
  }

  public remove(config: RemoveEventConfigInterface = {}): this {
    this.queue.push(new RemoveEvent(this, config));
    return this;
  }

  public type(config: TypeEventConfigInterface = {}): this {
    this.queue.push(new TypeEvent(this, config));
    return this;
  }

  public loop(config: LoopEventConfigInterface = {}): this {
    this.queue.push(new LoopEvent(this, config));
    return this;
  }

  public sleep(config: SleepEventConfigInterface = {}): this {
    this.queue.push(new SleepEvent(this, config));
    return this;
  }

  public start(): this {
    this.isActive = true;
    this.executeEvents();
    return this;
  }

  public async executeEvents() {
    const performEvent = this.queue.shift();
    if (performEvent) await this.executeEvent(performEvent);
  }

  public async executeEvent(event: Event) {
    if (this.activeInterval) {
      return;
    }

    if (event.isTypeEvent) {
      this.isTyping = true;
      this.isTypingListener(this.isTyping);
    }

    await event.execute();
    this.executedQueue.push(event);

    if (event.isTypeEvent) {
      this.isTyping = false;
      this.isTypingListener(this.isTyping);
    }

    if (this.queue.length > 0 && this.isActive) {
      const performEvent = this.queue.shift();
      if (performEvent) await this.executeEvent(performEvent);
    }
  }

  public setText(text: string) {
    this.text = text;
    this.textListener(text);
  }

  public stop() {
    this.isActive = false;
    this.clearInterval();
    this.clearTimeout();
  }

  public interval(onIntervalCalled: () => void, ms?: number): this {
    if (this.activeInterval !== undefined) return this;
    this.activeInterval = setInterval(() => {
      onIntervalCalled();
    }, ms || 1000);

    return this;
  }

  public clearInterval(): this {
    if (this.activeInterval) {
      clearInterval(this.activeInterval as number);
      this.activeInterval = undefined;
    }
    return this;
  }

  public timeout(onTimeoutCalled: () => void, ms?: number): this | undefined {
    if (this.activeTimeout !== undefined) return this;
    this.activeTimeout = setTimeout(() => {
      onTimeoutCalled();
    }, ms || 1000);
  }

  public clearTimeout(): this {
    if (this.activeTimeout) {
      clearTimeout(this.activeTimeout as number);
      this.activeTimeout = undefined;
    }
    return this;
  }
}

export type TextListenerType = (currentText: string) => void;
export type IsTypingListenerType = (isTyping: boolean) => void;

export interface CreateAutoTyperConfigInterface {
  textListener?: TextListenerType;
  isTypingListener?: IsTypingListenerType;
  initialText?: string;
  delay?: number;
}

export interface AutoTyperConfigInterface {
  initialText: string;
  delay: number;
}

export type Props = {
  words?: string[];
  delay?: number;
  typeSpeed?: number;
  defaultText?: string;
  className?: string;
};

export const Typer: React.FC<Props> = (props) => {
  const delay = props.delay || 500;
  const words = props.words || [];
  const defaultText = props.defaultText || "";
  const typeSpeed = props.typeSpeed || 100;
  const [text, setText] = useState(defaultText);

  useEffect(() => {
    const autoTyper = new AutoTyper({
      delay: typeSpeed,
      textListener: (currentText: string) => {
        setText(currentText);
      },
    });

    words.forEach((word) => {
      autoTyper.type({ toType: word }).sleep({ ms: delay }).remove();
    });

    autoTyper.loop().start();

    return () => {
      autoTyper.stop();
    };
  }, []);

  return (
    <div className="flex h-10 flex-row items-center justify-start md:h-20">
      <div className="text-[length:32px] font-black text-red-500 sm:text-[length:48px] 2xl:text-[length:72px]">
        {text}
      </div>
      <div
        className={`ml-1 h-8 w-2 bg-red-500 sm:h-10 sm:w-4 lg:ml-2 lg:h-14 xl:h-12 xl:w-5 2xl:h-16 ${"cursor-blink"}`}
      />
    </div>
  );
};
