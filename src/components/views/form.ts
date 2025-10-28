import { ensureElement } from "../../utils/utils";
import { EventEmitter } from "../base/Events";
import { Component } from "../base/Component";

export class Form extends Component<object> {
  protected errorsDisplay: HTMLElement;
  protected _submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._submitButton = ensureElement('button[type="submit"]', this.container) as HTMLButtonElement;
    this.errorsDisplay = ensureElement('.form__errors', this.container);

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log(`${this.container.getAttribute('name')}:submit`)
      this.events.emit(`${this.container.getAttribute('name')}:submit`)
    })
  }

    setError(message: string = ''): void {
        const errorElement = this.container.querySelector('.form__errors');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    disableFormButton(state: boolean): void {
        const button = this.container.querySelector('button[type="submit"]');
        if (button) {
            (button as HTMLButtonElement).disabled = !state;
        }
    }
}