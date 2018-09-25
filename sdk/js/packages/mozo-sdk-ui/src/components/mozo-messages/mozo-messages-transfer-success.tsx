import { Component, Method, Prop } from "@stencil/core";

@Component({
  tag: 'mozo-message-transfer-success',
  styleUrl: 'mozo-messages.scss'
})
export class MozoMessageTransferSuccess {
  @Prop() hash: string = "";

  @Method()
  async transferMozo(e) {
    e.preventDefault()
  }
  render() {

    return (
      <div class="mozo-form text-center">
        <div class="form-group">
          <svg xmlns="http://www.w3.org/2000/svg" width="165" height="60" viewBox="0 0 165 100">
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(65)">
                <circle cx="50" cy="50" r="50" fill="#5A9CF5" fill-rule="nonzero" />
                <path fill="#FFF" d="M74.76 34.133c.16.323.24.564.24.726 0 .16-.08.403-.24.725l-29.928 38.69c-.481.484-.842.726-1.082.726-.4 0-.801-.202-1.202-.605L25.601 57.952l-.36-.363c-.16-.322-.241-.564-.241-.725 0-.08.08-.282.24-.605l.24-.242c2.244-2.418 4.007-4.272 5.29-5.561.48-.484.8-.726.96-.726.321 0 .722.242 1.203.726l9.615 9.43 24.039-31.073c.16-.161.4-.242.72-.242.241 0 .522.081.842.242l6.61 5.32z" />
              </g>
              <g fill="#5A9CF5" fill-rule="nonzero" transform="translate(0 33)">
                <rect width="59" height="5" rx="2.5" />
                <rect width="14" height="5" x="45" y="30" rx="2.5" />
                <rect width="29" height="5" x="26" y="15" rx="2.5" />
              </g>
            </g>
          </svg>
        </div>
        <h3>Your TX has been broadcast.</h3>
        <div class="form-group">
          <small>Your TX Hash: {this.hash.substring(0, 30)}...</small>
        </div>
        {/* <div class="form-group">
          <input type="text" value={this.toAddressState} onInput={(e) => this.handleChangeAddress(e)} />
          <label>Receiver Address</label>
        </div>
        <div class="form-group">
          <input type="text" value={this.amountState} />
          <label>Amount</label>
        </div> */}
        <div class="form-action">
          <input class="mozo-btn w-xx-lg" type="button" value="View detail" onClick={(e) => this.transferMozo(e)} />
        </div>
      </div>
    )
  }
}