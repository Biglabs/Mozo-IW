//
//  CoreModuleInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/13/18.
//

import Foundation

protocol CoreModuleInterface {
    func requestForAuthentication(module: Module)
    func requestForLogout()
    func requestForCloseAllMozoUIs()
}
