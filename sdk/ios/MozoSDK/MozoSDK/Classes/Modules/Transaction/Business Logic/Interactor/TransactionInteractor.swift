//
//  TransactionInteractor.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

class TransactionInteractor : NSObject {
    var output : TransactionInteractorOutput?
    var signManager : TransactionSignManager?
    let apiManager : ApiManager
    
    var originalTransaction: TransactionDTO?
    var transactionData : IntermediaryTransactionDTO?
    var tokenInfo: TokenInfoDTO?
    
    init(apiManager: ApiManager) {
        self.apiManager = apiManager
    }
    
    func createTransactionToTransfer(tokenInfo: TokenInfoDTO?, toAdress: String?, amount: String?) -> TransactionDTO? {
        let input = InputDTO(addresses: [(tokenInfo?.address)!])!
        let trimToAddress = toAdress?.trimmingCharacters(in: .whitespacesAndNewlines)
        var value = 0.0
        if amount != nil {
            value = Double(amount!)!
        }
        var txValue = NSNumber(value: 0)
        txValue = value > 0.0 ? value.convertTokenValue(decimal: tokenInfo?.decimals ?? 0) : 0
        
        let output = OutputDTO(addresses: [trimToAddress!], value: txValue)!
        let transaction = TransactionDTO(inputs: [input], outputs: [output])
        
        return transaction
    }
}

extension TransactionInteractor : TransactionInteractorInput {
    func sendUserConfirmTransaction(_ transaction: TransactionDTO) {
        _ = apiManager.transferTransaction(transaction).done { (interTx) in
            if (interTx.errors != nil) && (interTx.errors?.count)! > 0 {
                self.output?.didReceiveError((interTx.errors?.first)!)
            } else {
                // Fix issue: Should keep previous value of transaction
                self.originalTransaction = transaction
                self.transactionData = interTx
                self.output?.requestPinToSignTransaction()
            }
        }
    }
    
    func validateTransferTransaction(tokenInfo: TokenInfoDTO?, toAdress: String?, amount: String?) {
        var error : String? = nil
        if toAdress == nil || toAdress == "" {
            error = "Please input receive address."
            output?.didValidateTransferTransaction(error)
            return
        }
        let value = amount
        if value == nil || value == "" {
            error = "Please input amount value."
            output?.didValidateTransferTransaction(error)
            return
        }
        
        let spendable = tokenInfo?.balance?.convertOutputValue(decimal: tokenInfo?.decimals ?? 0)
        if spendable! <= 0.0 {
            error = "Your spendable is not enough for this."
            output?.didValidateTransferTransaction(error)
            return
        }
        
        if Double(amount ?? "0")! > spendable! {
            error = "Your spendable is not enough for this."
            output?.didValidateTransferTransaction(error)
            return
        }

        let tx = createTransactionToTransfer(tokenInfo: tokenInfo, toAdress: toAdress, amount: amount)
        self.tokenInfo = tokenInfo
        output?.continueWithTransaction(tx!, tokenInfo: tokenInfo!)
    }
    
    func performTransfer(pin: String) {
        signManager?.signTransaction(transactionData!, pin: pin)
            .done { (signedInterTx) in
                self.apiManager.sendSignedTransaction(signedInterTx).done({ (receivedTx) in
                    print("Send successfully with hash: \(receivedTx.tx?.hash ?? "NULL")")
                    // Fix issue: Should keep previous value of transaction
                    receivedTx.tx = self.originalTransaction
                    print("Original output value: \(receivedTx.tx?.outputs![0].value ?? 0)")
                    self.output?.didSendTransactionSuccess(receivedTx, tokenInfo: self.tokenInfo!)
                }).catch({ (err) in
                    self.output?.didReceiveError(err.localizedDescription)
                })
            }.catch({ (err) in
                self.output?.didReceiveError(err.localizedDescription)
            })
    }
    
    func loadTokenInfo() {
        if let userObj = SessionStoreManager.loadCurrentUser() {
            if let address = userObj.profile?.walletInfo?.offchainAddress {
                print("Address used to load balance: \(address)")
                _ = apiManager.getTokenInfoFromAddress(address)
                    .done { (tokenInfo) in
                        self.output?.didLoadTokenInfo(tokenInfo)
                    }
            }
        }
    }
}
