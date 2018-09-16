//
//  PINTextFieldDelegate.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/16/18.
//

import Foundation

public protocol PinTextFieldDelegate: class {
    func textFieldShouldBeginEditing(_ textField: PinTextField) -> Bool // return false to disallow editing.
    
    func textFieldDidBeginEditing(_ textField: PinTextField) // became first responder
    
    func textFieldValueChanged(_ textField: PinTextField) // text value changed
    
    func textFieldShouldEndEditing(_ textField: PinTextField) -> Bool // return true to allow editing to stop and to resign first responder status at the last character entered event. NO to disallow the editing session to end
    
    func textFieldDidEndEditing(_ textField: PinTextField) // called when PinTextField did end editing
    
    func textFieldShouldReturn(_ textField: PinTextField) -> Bool // called when 'return' key pressed. return false to ignore.
}

/// default
public extension PinTextFieldDelegate {
    func textFieldShouldBeginEditing(_ textField: PinTextField) -> Bool {
        return true
    }
    
    func textFieldDidBeginEditing(_ textField: PinTextField) {
        
    }
    
    func textFieldValueChanged(_ textField: PinTextField) {
        
    }
    
    func textFieldShouldEndEditing(_ textField: PinTextField) -> Bool {
        return true
    }
    
    func textFieldDidEndEditing(_ textField: PinTextField) {
        
    }
    
    func textFieldShouldReturn(_ textField: PinTextField) -> Bool {
        return true
    }
    
}
