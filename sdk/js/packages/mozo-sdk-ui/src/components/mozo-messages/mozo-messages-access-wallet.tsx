import { Component, Prop } from "@stencil/core";

@Component({
  tag: 'mozo-messages-access-wallet',
  styleUrl: 'mozo-messages.scss'
})
export class MozoMessageAccessWallet {
  
  @Prop() call: () => void;
  
  render() {
    return (
      <div class="mozo-form text-center">
        <div class="form-group">
          <svg xmlns="http://www.w3.org/2000/svg" width="159" height="40" viewBox="0 0 159 40">
            <path fill="#141A22" fill-rule="evenodd" d="M28.474 0h8.304l-.27 40h-8.034V14.931l-9.895 12.544v.483l-.19-.241-.19.241v-.483L8.303 14.931V40H.27L0 0h8.304L18.39 13.828 28.474 0zm34.644 39.766c-10.888 0-19.715-8.902-19.715-19.883S52.23 0 63.118 0c10.89 0 19.716 8.902 19.716 19.883 0 10.98-8.827 19.883-19.716 19.883zm.169-9.177c5.77 0 10.448-4.717 10.448-10.536 0-5.82-4.678-10.536-10.448-10.536-5.77 0-10.448 4.717-10.448 10.536s4.678 10.536 10.448 10.536zm75.997 9.177c-10.888 0-19.715-8.902-19.715-19.883S128.396 0 139.284 0C150.174 0 159 8.902 159 19.883c0 10.98-8.827 19.883-19.716 19.883zm.169-9.177c5.77 0 10.448-4.717 10.448-10.536 0-5.82-4.678-10.536-10.448-10.536-5.77 0-10.448 4.717-10.448 10.536s4.678 10.536 10.448 10.536zM87.626 1.606h29.633L101.937 30.11h14.673v8.673H86.563l15.711-28.316H87.708l-.082-8.862z" />
          </svg>
        </div>
        <h3>Login required</h3>
        <div class="form-group">
          <p>You need to login to your Mozo account before using this feature</p>
        </div>
        <div class="form-action">
          <input class="mozo-btn w-xx-lg" type="button" value="Login to Mozo Account" onClick={() => {this.call()}} />
        </div>
      </div>
    )
  }
}

