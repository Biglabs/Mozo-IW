//
//  AuthModuleInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation

protocol AuthModuleInterface {
    func performAuthentication()
    func shouldHandleRedirectUrl() -> Bool
    func handleRedirectUrl(_ url: URL)
}
