import { Component, Method, Prop } from "@stencil/core";

@Component({
  tag: 'mozo-message-transfer-fail',
  styleUrl: 'mozo-messages.scss'
})
export class MozoMessageTransferFail {

  @Prop() message: string = ""
 
  @Method()
  async transferMozo(e) {
    e.preventDefault()
  }
  render() {
    console.log(this.message)
    return (
      <div class="mozo-form text-center">
        <div class="form-group mt-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="77" height="50" viewBox="0 0 77 73">
            <path fill="#F05454" fill-rule="evenodd" d="M76.449 67.969L40.824 1.406A3.153 3.153 0 0 0 39.808.391 2.598 2.598 0 0 0 38.402 0c-.52 0-.99.13-1.406.39-.417.261-.755.6-1.016 1.016L.355 67.97c-.26.416-.377.872-.351 1.367.026.495.143.95.351 1.367.26.417.612.742 1.055.977.443.234.898.351 1.367.351h71.25c.469 0 .924-.117 1.367-.351.443-.235.794-.56 1.055-.977.208-.417.325-.872.351-1.367a2.293 2.293 0 0 0-.351-1.367zm-34.063-3.906h-7.968v-8.047h7.968v8.047zm0-14.063h-7.968V24.062h7.968V50z" />
          </svg>
        </div>
        <h3>{this.message}</h3>
        {/* <div class="form-group">

        </div> */}
        {/* <div class="form-group">
          <input type="text" value={this.toAddressState} onInput={(e) => this.handleChangeAddress(e)} />
          <label>Receiver Address</label>
        </div>
        <div class="form-group">
          <input type="text" value={this.amountState} />
          <label>Amount</label>
        </div> */}
        {/* <div class="form-action">
          <input class="mozo-btn w-xx-lg" type="button" value="View detail" onClick={(e) => this.transferMozo(e)} />
        </div> */}
      </div>
    )
  }
}

