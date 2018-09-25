//
//  ConfirmTransferViewInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/25/18.
//

import Foundation
protocol ConfirmTransferViewInterface {
    func displayError(_ error: String)
    func displaySpinner()
    func removeSpinner()
}
