//
//  AuthModuleDelegateInterface.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/12/18.
//

import Foundation

protocol AuthModuleDelegate {
    func authModuleDidFinishAuthentication(accessToken: String?)
    func authModuleDidCancelAuthentication()
    func authModuleDidFinishLogout()
    func authModuleDidCancelLogout()
}
