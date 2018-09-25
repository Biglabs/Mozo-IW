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
        <button class="btn-close" onClick={this.closeModal.bind(this)}>
          <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#979197" fill-rule="evenodd" d="M12 10.13L8.261 6.39a1.324 1.324 0 0 0-1.873-.002c-.52.52-.515 1.355.002 1.873L10.13 12l-3.74 3.739a1.324 1.324 0 0 0-.002 1.873c.52.52 1.355.515 1.873-.002L12 13.87l3.739 3.74a1.324 1.324 0 0 0 1.873.002c.52-.52.515-1.355-.002-1.873L13.87 12l3.74-3.739a1.324 1.324 0 0 0 .002-1.873 1.321 1.321 0 0 0-1.873.002L12 10.13z"></path></svg>
        </button>
        <modal-content></modal-content>
      </div>
    )
  }
}
