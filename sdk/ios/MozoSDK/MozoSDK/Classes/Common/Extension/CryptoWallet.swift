//
//  CryptoWallet.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/4/18.
//

import Foundation
import CryptoSwift
import RNCryptor

public extension String {
    public func toSHA512() -> String {
        return self.sha512()
    }
    
    public func encrypt(key: String) -> String {
        let data: Data = self.data(using: .utf8)!
        let encryptedData = RNCryptor.encrypt(data: data, withPassword: key)
        let encryptedString : String = encryptedData.base64EncodedString() // getting base64encoded string of encrypted data.
        return encryptedString
    }
    
    public func decrypt(key: String) -> String {
        do  {
            let data: Data = Data(base64Encoded: self)! // Just get data from encrypted base64Encoded string.
            let decryptedData = try RNCryptor.decrypt(data: data, withPassword: key)
            let decryptedString = String(data: decryptedData, encoding: .utf8) // Getting original string, using same .utf8 encoding option,which we used for encryption.
            return decryptedString ?? ""
        }
        catch {
            print("Decrypt error: [\(error)]")
            return ""
        }
    }
}
