import type { PropsWithChildren } from "react";

interface ModalElement {
  onClose?: () => void;
}

export function Modal(props: PropsWithChildren<ModalElement>) {
  return (
    <div className="relative z-10" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-dark-gray bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-10 h-full overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-night text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
            <button
              title="close"
              aria-label="close"
              disabled={!props.onClose}
              className="absolute right-0 top-0 pr-3 pt-2 text-2xl disabled:text-gray"
              onClick={props.onClose}
            >
              x
            </button>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
