import { Component, Prop, State, Method, Element } from '@stencil/core';
import copy from 'copy-to-clipboard';
import QRCode from 'qrcode'

import { ShowMessage } from "../../utils/helpers"
import { Services } from "../../services"


@Component({
  tag: 'mozo-offchain',
  styleUrl: 'mozo-offchain.scss',
  //shadow: true
})
export class MozoOffChain {

  @Prop() amount: number;
  @Prop() toAddress: string = "";
  @Prop() showQrCode: boolean = false;

  @State() amountState: number;
  @State() addressState: string = "";
  @State() accessWallet: boolean = false;
  @State() amountIsWrong: boolean = false;
  @State() urlQRcode: string;

  @Element() el!: HTMLElement;

  @Method()
  async transferMozo(e) {
    e.preventDefault()

    let result = await Services.checkWallet()
    if (result) {
      if (result.status == "SUCCESS") {
        const txResult = await ShowMessage.showTransactionWallet({ to: this.addressState, value: this.amountState, network: "SOLO" })

        if (txResult) {
          if (txResult.status == "SUCCESS") {
            ShowMessage.showTransferSuccess(txResult.data.tx.hash)
          } else {
            ShowMessage.showTransferFail()
          }

        }
      } else {
        this.accessWallet = false
      }
    }
  }

  async componentDidLoad() {
    // this.amountState = this.amount;
    // this.toAddressState = this.toAddress;

    // if (this.toAddress.trim() != "" && !(/^(0x)?[0-9a-fA-F]{40}$/.test(this.toAddress.trim()))) {
    //   this.accessWallet = true
    // } else {
    //   this.accessWallet = false
    // }

    // if (this.amountState.toString().trim() != "" && isNaN(this.amountState)) {
    //   this.amountIsWrong = true
    // } else {
    //   this.amountIsWrong = false
    // }

    let result = await Services.checkWallet()
    if (result) {
      if (result.status == "SUCCESS") {
        const walletResult = await Services.getWalletBalance({ network: "SOLO" })

        if (walletResult) {
          if (walletResult.status == "SUCCESS") {
            console.log(walletResult.data)
            this.amountState = walletResult.data.balance
            this.addressState = walletResult.data.address
            this.accessWallet = true
          } else {
            ShowMessage.showTransferFail()
          }
        }
      } else {
        this.accessWallet = false
      }
    }
  }

  handleChangeAddress(event) {
    const value = event.target.value;
    this.addressState = value;

    if (value.trim() == "" || !(/^(0x)?[0-9a-fA-F]{40}$/.test(value.trim()))) {
      this.accessWallet = true
    } else {
      this.accessWallet = false
    }

    console.log(this.addressState)
  }

  handleChangeAmount(event) {
    const value = event.target.value;
    this.amountState = value;

    if (this.amountState.toString().trim() == "" || isNaN(this.amountState)) {
      this.amountIsWrong = true
    } else {
      this.amountIsWrong = false
    }

    console.log(this.addressState)
  }

  copyAddress() {
    copy(this.addressState)
  }

  render() {
    return (
      <div class={"mozo-box" + (this.showQrCode && this.accessWallet ? " qr-code-container" : "")}>
        <div class="form-text-view">
          <label class="form-label">Mozo Offchain Balance</label>
          <div>
            {this.accessWallet ? <label class="text-primary text-lg text-inline">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <g fill="none" fill-rule="evenodd">
                  <circle cx="12" cy="12" r="12" fill="#5A9CF5" />
                  <path fill="#FFF" stroke="#FFF" stroke-linecap="round" stroke-linejoin="round" stroke-width=".9" d="M14.582 7.04c.794-.13 2.875-.114 3.743 2.746.528 1.742.33 3.587 0 5.252h.505c.094 0 .17.079.17.176v.61a.173.173 0 0 1-.17.176h-1.903a.173.173 0 0 1-.17-.175v-.611c0-.097.076-.176.17-.176h.53c.26-.85.256-2.844-.107-4.167-.304-1.315-1.26-2.383-2.454-2.383-.587 0-2.39.077-2.713 4.584v.24h-.366v-.24c-.323-4.507-2.126-4.584-2.713-4.584-1.194 0-2.15 1.068-2.454 2.383-.363 1.323-.368 3.316-.107 4.167h.53c.094 0 .17.079.17.176v.61a.173.173 0 0 1-.17.176H5.17a.173.173 0 0 1-.17-.175v-.611c0-.097.076-.176.17-.176h.505c-.33-1.665-.528-3.51 0-5.252.868-2.86 2.949-2.876 3.743-2.745 1.454.302 2.204 1.34 2.582 2.555.378-1.216 1.128-2.253 2.582-2.555z" />
                </g>
              </svg>&nbsp;<span id="mozoAddress">{new Intl.NumberFormat().format(this.amountState)}</span></label> :
              <label class="text-note">You must be <a class="text-link" onClick={() => ShowMessage.openWallet(
                () => {

                }
              )}>Login</a> to use this function</label>}
          </div>
        </div>
        {this.accessWallet && <div>
          <label class="form-label">Your Mozo Offchain Wallet Address</label>
          <div>
            <label class="text-inline">
              <span class="text-address">{this.addressState}</span> &nbsp;
              <svg class="text-link" onClick={() => this.copyAddress()} xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18">
                <path fill="#5A9CF5" fill-rule="evenodd" d="M15.195 16.353V4.903H5.373v11.45h9.822zm0-13.06c.476 0 .896.16 1.26.48.363.318.545.695.545 1.13v11.45c0 .434-.182.817-.546 1.15a1.813 1.813 0 0 1-1.259.497H5.373c-.476 0-.896-.166-1.26-.498-.363-.332-.545-.715-.545-1.149V4.903c0-.435.182-.812.546-1.13.363-.32.783-.48 1.259-.48h9.822zM12.51 0v1.647H1.763v11.45H0V1.648C0 1.213.175.83.525.497A1.74 1.74 0 0 1 1.763 0h10.746z" />
              </svg>&nbsp;<a class="text-link" onClick={() => this.copyAddress()}><small>copy</small></a>
            </label>
          </div>
        </div>}
        {(this.urlQRcode && this.showQrCode) && <img class="qr-code-img" src={this.urlQRcode} />}
          
          {this.addressState && QRCode.toDataURL(this.addressState)
            .then(url => {
              console.log(url)
              this.urlQRcode = url
            })
            .catch(err => {
              console.error(err)
            })
          }
      </div>
    );
  }
}
