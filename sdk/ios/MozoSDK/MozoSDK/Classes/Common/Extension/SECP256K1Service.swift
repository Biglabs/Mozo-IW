//
//  SECP256K1Service.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/23/18.
//

import Foundation
import secp256k1_ios

public struct SECP256K1Service {
    static var context = secp256k1_context_create(UInt32(SECP256K1_CONTEXT_SIGN|SECP256K1_CONTEXT_VERIFY))
    
    static func sign(hash: Data, privateKey: Data, useExtraEntropy: Bool = true) -> secp256k1_ecdsa_signature? {
        var signature: secp256k1_ecdsa_signature = secp256k1_ecdsa_signature();
        let result = hash.withUnsafeBytes { (hashPointer:UnsafePointer<UInt8>) -> Int32 in
            privateKey.withUnsafeBytes { (privateKeyPointer:UnsafePointer<UInt8>) -> Int32 in
                withUnsafeMutablePointer(to: &signature, { (recSignaturePtr: UnsafeMutablePointer<secp256k1_ecdsa_signature>) -> Int32 in
                    let res = secp256k1_ecdsa_sign(context!, recSignaturePtr, hashPointer, privateKeyPointer, secp256k1_nonce_function_rfc6979, nil)
                    return res
                })
            }
        }
        if result == 0 {
            print("Failed to sign!")
            return nil
        }
        
        return signature
    }
    
    static func serializeDerFormat(signature: inout secp256k1_ecdsa_signature) -> Data? {
        var sig = [UInt8](repeating: 0, count:72)
        var siglen: Int = sig.count
        _ = secp256k1_ecdsa_signature_serialize_der(context!, &sig, &siglen, &signature)
        
        return Data(sig)
    }
}

extension String {
    /**
     Signing message by using private key
     
     - Parameter message: Message that should be signed
     - Parameter privateKey: Address's private key
     
     - Returns: Signed message, that can be verified at https://www.myetherwallet.com/signmsg.html
     or **nil** if something goes wrong
     */
    func ethSign(privateKey: String) -> String? {
        let buffer = Data(hex: privateKey)
        let tosign = self.replace("0x", withString: "")
        let data = Data(hex: tosign)
        
        // EC sign
        var signature = SECP256K1Service.sign(hash: data, privateKey: buffer)
        
        // Serialize with DER format
        let signatureData = SECP256K1Service.serializeDerFormat(signature: &signature!)
        
        let signedMessage = signatureData?.toHexString()
        
        return signedMessage
    }
    
    func addHexPrefix() -> String {
        if !self.hasPrefix("0x") {
            return "0x" + self
        }
        return self
    }
}
