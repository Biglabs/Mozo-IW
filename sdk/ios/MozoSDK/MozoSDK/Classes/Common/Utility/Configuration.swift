//
//  Configuration.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/4/18.
//

import Foundation
import UIKit

public class Configuration {
    public static let DEBUG = false
    public static let GRANT_TYPE = "password"
    public static let MIN_PASSWORD_LENGTH = 6
    public static var FONT_SIZE: UIFontTextSize = UIFontTextSize(.xSmall)
    public static let DEVICE_TOKEN = "DEVICE_TOKEN"
    // Access token for anonymous user
    public static let ACCESS_TOKEN_ANONYMOUS = "Mozo@AccessToken@Anonymous"
    // Access token
    public static let ACCESS_TOKEN = "Mozo@AccessToken"
    // User info
    public static let USER_INFO = "Mozo@UserInfo"
    // User profile
    public static let USER_PROFILE = "Mozo@UserProfile"
    
    //Wallet
    public static let WALLLET_ID = "WalletId"
    
    //development
    public static let BASE_URL = "http://192.168.1.98:9000"
    
    // MARK: Auth
    /**
     The OIDC issuer from which the configuration will be discovered.
     */
    public static let AUTH_ISSSUER = "https://dev.keycloak.mozocoin.io/auth/realms/mozo"
    
    /**
     The OAuth client ID.
     For client configuration instructions, see the [README](https://github.com/openid/AppAuth-iOS/blob/master/Examples/Example-iOS_Swift-Carthage/README.md).
     Set to nil to use dynamic registration with this example.
     */
    public static let AUTH_CLIENT_ID = "native_app"
    
    /**
     The OAuth redirect URI for the client @c kClientID.
     For client configuration instructions, see the [README](https://github.com/openid/AppAuth-iOS/blob/master/Examples/Example-iOS_Swift-Carthage/README.md).
     */
    public static let AUTH_REDIRECT_URL = "com.mozo.sdk:/oauth2redirect/mozo-provider"
    
    /**
     NSCoding key for the authState property.
     */
    public static let AUTH_STATE = "Mozo@AuthState"
}
