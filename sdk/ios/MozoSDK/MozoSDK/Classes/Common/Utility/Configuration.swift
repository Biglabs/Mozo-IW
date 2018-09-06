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
    public static let OAUTH_CLIENT_ID = ""
    public static let OAUTH_SECRET = ""
    public static let GRANT_TYPE = "password"
    public static let MIN_PASSWORD_LENGTH = 6
    public static var FONT_SIZE: UIFontTextSize = UIFontTextSize(.xSmall)
    public static let DEVICE_TOKEN = "DEVICE_TOKEN"
    // User info
    public static let USER_INFO = "Mozo@UserInfo"
    // User profile
    public static let USER_PROFILE = "Mozo@UserProfile"
    
    //Wallet
    public static let WALLLET_ID = "WalletId"
    
    //development
    public static var BASE_URL = "http://192.168.1.98:9000"
}
