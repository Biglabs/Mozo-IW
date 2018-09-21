import { Component, Prop, Method, Element } from '@stencil/core';

import { ShowMessage } from "../../utils/helpers"
import { Services } from "../../services"


@Component({
  tag: 'mozo-transfer-form',
  styleUrl: 'mozo-transfer-form.css',
  //shadow: true
})
export class MozoTransferForm {

  @Prop() value: number;
  @Prop() toAddress: string = "0x23232342342342342342342";

  @Element() el!: HTMLElement;

  @Method()
  async transferMozo(e) {
    e.preventDefault()

    let result = await Services.checkWallet()

    console.log(result)
    if (result) {
      result = result.result
      if (result.status == "SUCCESS") {
        const txResult = await ShowMessage.showTransactionWallet({ to: "0xcb1a15656af3da92e186f4c5abee4c177163fb02", value: 2000 })
        
        console.log("txResult", txResult)
        
        ShowMessage.closeModal()
      } else {
        await ShowMessage.accessWalletFail()
      }
    }
  }

  async componentDidLoad() {

    //  Services.checkWallet().then(
    //   (data) => console.log(data),
    //   (err) => console.log(err),
    // );
    // let result = await Services.checkWallet()
    // console.log(result)
    // const body = this.el.closest('body');
    // //const contentEl = this.el.closest('ion-content');
    // // if (contentEl) {
    // //   await contentEl.componentOnReady();
    // //   this.scrollEl = await contentEl.getScrollElement();
    // // }
    // if (body) {
    //   let mozoModal = document.createElement('mozo-modal');

    //   await body.componentOnReady();
    //   await body.appendChild(mozoModal);

    //   let h1 = document.createElement('h1');
    //   h1.innerText = "aaaaaa"
    //   await mozoModal.createModal(h1)
    //   //var modal = document.querySelector("mozo-modal");
    //   mozoModal.style.display = "block";
    // }
  }


  render() {
    return (
      <div>
        <label>To Address</label><br />
        <input type="text" value={this.toAddress} /><br />
        <label>Value</label><br />
        <input type="text" value={this.value} /><br />
        <input type="button" value="Submit" onClick={(e) => this.transferMozo(e)} />
      </div>
    );
  }
}
