//import { Element } from '@stencil/core';
import protocolCheck from 'custom-protocol-detection'
import { Services } from "../services"
const uri = 'solosigners:'

async function _checkModalAvailable() {
  const body = document.querySelector('body');
  let mozoModal = document.querySelector('mozo-modal');

  if (body) {
    await body.componentOnReady();

    if (!mozoModal) {
      mozoModal = document.createElement('mozo-modal');
    }
    await body.appendChild(mozoModal);
  }
  return mozoModal
}

function CloseModal() {
  let mozoModal = document.querySelector('mozo-modal');

  if (mozoModal) {
    mozoModal.closeModal()
  }
}

function _openWallet(callBack) {
  protocolCheck(uri,
    async () => {
      await InstallWalletMessage()
    },
    async () => {
      callBack()
    },
    () => {
      console.log('This browser does not provide a method to detect protocol support')
    })
}



async function AccessWalletFail() {

  let mozoModal = await _checkModalAvailable();

  if (mozoModal) {
    await mozoModal.componentOnReady()
    let modalContent = await mozoModal.querySelector('modal-content');
    modalContent.innerHTML = `
    <div class="mozo-form text-center">
    <div class="form-group logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="159" height="80" viewBox="0 0 159 40">
        <path fill="#141A22" fill-rule="evenodd" d="M28.474 0h8.304l-.27 40h-8.034V14.931l-9.895 12.544v.483l-.19-.241-.19.241v-.483L8.303 14.931V40H.27L0 0h8.304L18.39 13.828 28.474 0zm34.644 39.766c-10.888 0-19.715-8.902-19.715-19.883S52.23 0 63.118 0c10.89 0 19.716 8.902 19.716 19.883 0 10.98-8.827 19.883-19.716 19.883zm.169-9.177c5.77 0 10.448-4.717 10.448-10.536 0-5.82-4.678-10.536-10.448-10.536-5.77 0-10.448 4.717-10.448 10.536s4.678 10.536 10.448 10.536zm75.997 9.177c-10.888 0-19.715-8.902-19.715-19.883S128.396 0 139.284 0C150.174 0 159 8.902 159 19.883c0 10.98-8.827 19.883-19.716 19.883zm.169-9.177c5.77 0 10.448-4.717 10.448-10.536 0-5.82-4.678-10.536-10.448-10.536-5.77 0-10.448 4.717-10.448 10.536s4.678 10.536 10.448 10.536zM87.626 1.606h29.633L101.937 30.11h14.673v8.673H86.563l15.711-28.316H87.708l-.082-8.862z" />
      </svg>
    </div>
    <h3>Login required</h3>
    <div class="form-group">
      <p>You need to login to your Mozo account before using this feature</p>
    </div>
    <div class="form-action">
      <input id="accessMOZOWallet" class="mozo-btn w-xx-lg" type="button" value="Login to Mozo Account" />
    </div>
  </div>
      `;

    // listen for close event
    const button = mozoModal.querySelector('#accessMOZOWallet');
    button.addEventListener('click', () => {
      _openWallet(() => {
        mozoModal.closeModal()
      })
    });
    await mozoModal.componentOnReady()
    await mozoModal.openModal()
  }
}

async function InstallWalletMessage() {

  let mozoModal = await _checkModalAvailable();

  if (mozoModal) {
    await mozoModal.componentOnReady()
    let modalContent = await mozoModal.querySelector('modal-content');
    modalContent.innerHTML = `
    <div class="mozo-form text-center">
    <div class="form-group logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="159" height="80" viewBox="0 0 159 40">
        <path fill="#141A22" fill-rule="evenodd" d="M28.474 0h8.304l-.27 40h-8.034V14.931l-9.895 12.544v.483l-.19-.241-.19.241v-.483L8.303 14.931V40H.27L0 0h8.304L18.39 13.828 28.474 0zm34.644 39.766c-10.888 0-19.715-8.902-19.715-19.883S52.23 0 63.118 0c10.89 0 19.716 8.902 19.716 19.883 0 10.98-8.827 19.883-19.716 19.883zm.169-9.177c5.77 0 10.448-4.717 10.448-10.536 0-5.82-4.678-10.536-10.448-10.536-5.77 0-10.448 4.717-10.448 10.536s4.678 10.536 10.448 10.536zm75.997 9.177c-10.888 0-19.715-8.902-19.715-19.883S128.396 0 139.284 0C150.174 0 159 8.902 159 19.883c0 10.98-8.827 19.883-19.716 19.883zm.169-9.177c5.77 0 10.448-4.717 10.448-10.536 0-5.82-4.678-10.536-10.448-10.536-5.77 0-10.448 4.717-10.448 10.536s4.678 10.536 10.448 10.536zM87.626 1.606h29.633L101.937 30.11h14.673v8.673H86.563l15.711-28.316H87.708l-.082-8.862z" />
      </svg>
    </div>
    <h3>Download Mozo Wallet</h3>
    <div class="form-group">
      <p>You need to download Mozo Wallet first</p>
    </div>
    <div class="form-action">
      <input id="downloadWallet" class="mozo-btn w-xx-lg" type="button" value="Download Mozo Wallet" />
    </div>
  </div>
      `;

    // listen for close event
    const button = mozoModal.querySelector('#downloadWallet');
    button.addEventListener('click', () => {
      window.open("https://google.com", "_blank");
      mozoModal.closeModal();
    });
    await mozoModal.componentOnReady()
    await mozoModal.openModal()
  }
}

async function ShowTransactionForm(data: any) {

  let mozoModal = await _checkModalAvailable();

  if (mozoModal) {
    await mozoModal.componentOnReady()
    let modalContent = mozoModal.querySelector('modal-content');


    modalContent.innerHTML = `
      <mozo-transfer-form amount=${data.amount || 0} to-address=${data.toAddress || ""}>
      </mozo-transfer-form>
      `;

    // listen for close event
    // const button = mozoModal.querySelector('button');
    // button.addEventListener('click', () => {
    //   mozoModal.closeModal();
    // });
    await mozoModal.componentOnReady()
    mozoModal.openModal()
  }
}

async function ShowTransferSuccess(hash: string) {
  let mozoModal = await _checkModalAvailable();

  if (mozoModal) {
    await mozoModal.componentOnReady()
    let modalContent = mozoModal.querySelector('modal-content');


    modalContent.innerHTML = `
      <mozo-message-transfer-success hash=${hash}>
      </mozo-message-transfer-success>
      `;

    // listen for close event
    // const button = mozoModal.querySelector('button');
    // button.addEventListener('click', () => {
    //   mozoModal.closeModal();
    // });
    await mozoModal.componentOnReady()
    mozoModal.openModal()
  }
}

async function ShowTransferFail() {
  let mozoModal = await _checkModalAvailable();

  if (mozoModal) {
    await mozoModal.componentOnReady()
    let modalContent = mozoModal.querySelector('modal-content');


    modalContent.innerHTML = `
      <mozo-message-transfer-fail>
      </mozo-message-transfer-fail>
      `;

    // listen for close event
    // const button = mozoModal.querySelector('button');
    // button.addEventListener('click', () => {
    //   mozoModal.closeModal();
    // });
    await mozoModal.componentOnReady()
    mozoModal.openModal()
  }
}

async function ShowTransactionWallet(data: any) {
  return await Services.sendTransaction(data)
}

export const ShowMessage = {
  closeModal: CloseModal,
  accessWalletFail: AccessWalletFail,
  showTransactionForm: ShowTransactionForm,
  showTransactionWallet: ShowTransactionWallet,
  showTransferSuccess: ShowTransferSuccess,
  showTransferFail: ShowTransferFail
}