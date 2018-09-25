//import { Element } from '@stencil/core';
import protocolCheck from 'custom-protocol-detection'
import { Services } from "../services"
const uri = 'solosigner:'

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
      <div class="mozo-form">
        <h3>Please access to Mozo Wallet</h3>
        <button class="mozo-btn" id="accessMOZOWallet">Access to MOZO Wallet</button>
        <p>If you have not installed the Mozo wallet yet. Please click here to download the installation file.</p>
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
      <div>
        <h5>Please download and install Mozo Wallet</h5>
        <p>If you have not yet installed the Mozo wallet. Please click here to download instalation file.</p>
      </div>
      `;

    // listen for close event
    // const button = mozoModal.querySelector('button');
    // button.addEventListener('click', () => {
    //   _openWallet()
    // });
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

async function ShowTransactionWallet(data: any) {
  return await Services.sendTransaction(data)
}

export const ShowMessage = {
  closeModal: CloseModal,
  accessWalletFail: AccessWalletFail,
  showTransactionForm: ShowTransactionForm,
  showTransactionWallet: ShowTransactionWallet,
  showTransferSuccess: ShowTransferSuccess
}