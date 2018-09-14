//
//  CoreInteractorIO.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/13/18.
//

import Foundation

protocol CoreInteractorInput {
    func checkForAuthentication()
    func handleAferAuth(accessToken: String?)
    func logout()
}

protocol CoreInteractorOutput {
    func finishedCheckAuthentication(keepGoing: Bool)
    func finishedHandleAferAuth()
}
