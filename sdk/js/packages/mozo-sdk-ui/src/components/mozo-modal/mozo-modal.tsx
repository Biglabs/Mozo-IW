import { Component, Method, Element, Prop, State } from "@stencil/core";

@Component({
  tag: 'mozo-modal',
  styleUrl: 'mozo-modal.scss'
})
export class MozoModal {

  buttons = ["Okay", "Cancel"]

  @Element() modalEl: HTMLElement;

  @Prop() title: string;
  @Prop() content: HTMLElement;

  @State() showOptions = true;
  @State() modalContent: any;

  @Method()
  async createModal(modalContent: any) {
    this.modalEl.appendChild(modalContent);
  }

  @Method()
  openModal() {
    this.modalEl.style.display = "block";
  }

  @Method()
  closeModal() {
    this.modalEl.style.display = 'none';
  }

  render() {

    return (
      <div>
        <modal-content></modal-content>
        {this.buttons.map(btn => (
          <button onClick={this.closeModal.bind(this)}>{btn}</button>
        ))}
      </div>
    )
  }
}
