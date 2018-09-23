//
//  SECP256K1Service.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/23/18.
//

import Foundation
import secp256k1_ios
import BigInt
import CryptoSwift

public struct SECP256K1Service {
    public struct UnmarshaledSignature{
        var v: UInt8
        var r = [UInt8](repeating: 0, count: 32)
        var s = [UInt8](repeating: 0, count: 32)
    }
    
    static var secp256k1_N  = BigUInt("fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141", radix: 16)!
    static var secp256k1_halfN = secp256k1_N >> 2
}

extension SECP256K1Service {
    static var context = secp256k1_context_create(UInt32(SECP256K1_CONTEXT_SIGN|SECP256K1_CONTEXT_VERIFY))
    
    static func sign(hash: Data, privateKey: Data, useExtraEntropy: Bool = true) -> secp256k1_ecdsa_signature? {
        var signature: secp256k1_ecdsa_signature = secp256k1_ecdsa_signature();
        let result = hash.withUnsafeBytes { (hashPointer:UnsafePointer<UInt8>) -> Int32 in
            privateKey.withUnsafeBytes { (privateKeyPointer:UnsafePointer<UInt8>) -> Int32 in
                withUnsafeMutablePointer(to: &signature, { (recSignaturePtr: UnsafeMutablePointer<secp256k1_ecdsa_signature>) -> Int32 in
                    let res = secp256k1_ecdsa_sign(context!, recSignaturePtr, hashPointer, privateKeyPointer, nil, nil)
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
        var sig = [UInt8](repeating: 0, count:74)
        var siglen: Int = 74
        _ = secp256k1_ecdsa_signature_serialize_der(context!, &sig, &siglen, &signature)
        
        return Data(sig)
    }
    
    func toByteArray<T>(_ value: T) -> [UInt8] {
        var value = value
        return withUnsafeBytes(of: &value) { Array($0) }
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
        let buffer = privateKey.data(using: .utf8)
        let tosign = self.data(using: .utf8)
//            .replace("0x", withString: "")
        // EC sign
        var signature = SECP256K1Service.sign(hash: tosign!, privateKey: buffer!)
        
//        let marshall = Data(signature)
        
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
