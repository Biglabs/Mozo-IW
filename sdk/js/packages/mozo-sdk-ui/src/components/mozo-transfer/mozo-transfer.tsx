import { Component, Prop, Method, Element } from '@stencil/core';
// import protocolCheck from 'custom-protocol-detection'
// const uri = 'solosigner:'

import {ShowMessage} from "../../utils/helpers"

import {Services} from "../../services"


@Component({
  tag: 'mozo-transfer',
  styleUrl: 'mozo-transfer.css'
})
export class MozoTransfer {

  @Prop() value: string = "MOZO Payment";
  @Prop() toAddress: string = "";
  @Prop() amount: number = 0;

  @Element() el!: HTMLElement;

  @Method()
  async transferMozo(e) {
    e.preventDefault()
    // protocolCheck(uri,
    //   () => {
    //     console.log('This browser does not support the protocol')
    //   },
    //   async () => {
    //      await ShowMessage.accessWalletFail()
    //   },
    //   () => {
    //     console.log('This browser does not provide a method to detect protocol support')
    //   })

    let result = await Services.checkWallet()
    console.log(result)
    if(result) {
      if(result.status == "SUCCESS") {
        await ShowMessage.showTransactionForm({toAddress: this.toAddress, amount: this.amount})
      } else {
        await ShowMessage.accessWalletFail()
      }
    }
  }

  async open() {
    var modal = document.querySelector("mozo-modal");

    // let h1 = document.createElement('h1');
    // h1.innerText = "aaaaaa"
    // await modal.createModal(h1)
    modal.style.display = "block";
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
        <input class="mozo-btn" type="button" value={this.value} onClick={(e) =>  this.transferMozo(e)} />
      </div>

    );
  }
}
