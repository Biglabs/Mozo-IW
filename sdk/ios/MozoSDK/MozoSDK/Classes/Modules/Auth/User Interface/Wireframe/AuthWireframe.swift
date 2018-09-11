//
//  AuthWireframe.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/10/18.
//

import Foundation

class AuthWireframe: MozoWireframe {
    var authPresenter : AuthPresenter?
    
    func presentInitialAuthInterface(){
        presentWaitingInterface()
        authPresenter?.performAuthentication()
    }
    
    func dismissAuthInterface(){
        
    }
}
