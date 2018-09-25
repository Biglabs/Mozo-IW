//
//  TransferViewInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/19/18.
//

import Foundation

protocol TransferViewInterface {
    func updateUserInterfaceWithTokenInfo(_ tokenInfo: TokenInfoDTO)
    func updateUserInterfaceWithAddress(_ address: String)
    func displayError(_ error: String)
}
