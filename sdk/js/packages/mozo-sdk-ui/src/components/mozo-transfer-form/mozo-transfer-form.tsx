import { Component, Prop, State, Method, Element } from '@stencil/core';

import { ShowMessage } from "../../utils/helpers"
import { Services } from "../../services"


@Component({
  tag: 'mozo-transfer-form',
  styleUrl: 'mozo-transfer-form.scss',
  //shadow: true
})
export class MozoTransferForm {

  @Prop() amount: number = 0;
  @Prop() toAddress: string = "";

  @State() amountState: number = 0;
  @State() toAddressState: string = "";
  @State() addressIsWrong: boolean = false;
  @State() amountIsWrong: boolean = false;

  @Element() el!: HTMLElement;

  @Method()
  async transferMozo(e) {
    e.preventDefault()

    let result = await Services.checkWallet()

    console.log(result)
    if (result) {
      if (result.status == "SUCCESS") {
        const txResult = await ShowMessage.showTransactionWallet({ to: this.toAddressState, value: this.amountState, network: "SOLO" })

        if (txResult) {
          ShowMessage.showTransferSuccess(txResult.data.tx.hash)
        }


        //ShowMessage.closeModal()
      } else {
        await ShowMessage.accessWalletFail()
      }
    }
  }

  componentDidLoad() {
    this.amountState = this.amount;
    this.toAddressState = this.toAddress;

    if (this.toAddress.trim() == "" || !(/^(0x)?[0-9a-fA-F]{40}$/.test(this.toAddress.trim()))) {
      this.addressIsWrong = true
    } else {
      this.addressIsWrong = false
    }
  }

  handleChangeAddress(event) {
    const value = event.target.value;
    this.toAddressState = value;

    if (value.trim() == "" || !(/^(0x)?[0-9a-fA-F]{40}$/.test(value.trim()))) {
      this.addressIsWrong = true
    } else {
      this.addressIsWrong = false
    }

    console.log(this.toAddressState)
  }

  handleChangeAmount(event) {
    const value = event.target.value;
    this.amountState = value;

    if (isNaN(this.amountState)) {
      this.amountIsWrong = true
    } else {
      this.amountIsWrong = false
    }

    console.log(this.toAddressState)
  }

  render() {
    return (
      <div class="mozo-form">
        <h3>Send Mozo Off-chain</h3>
        <div class="form-group">
          <input type="text" value={this.toAddressState} onInput={(e) => this.handleChangeAddress(e)} />
          <label>Receiver Address</label>
          {this.addressIsWrong && <small class="mozo-error-message">Recipient address is invalid</small>}
        </div>
        <div class="form-group">
          <input type="text" value={this.amountState} onInput={(e) => this.handleChangeAmount(e)}/>
          <label>Amount</label>
          {this.amountIsWrong && <small class="mozo-error-message">Amount is not a number</small>}
        </div>
        <div class="form-action">
          <input disabled = {this.addressIsWrong || this.amountIsWrong } class="mozo-btn w-xx-lg" type="button" value="Submit" onClick={(e) => this.transferMozo(e)} />
        </div>
      </div>
    );
  }
}
