//
//  PINViewInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/28/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

protocol PINViewInterface {
    func showConfirmPIN()
    func showVerificationFailed()
    func showCreatingInterface()
    
    func displaySpinner()
    func removeSpinner()
    func displayError(_ error: String)
}
