//
//  Enum+Protocol.swift
//  Alamofire
//
//  Created by Tam Nguyen on 7/3/18.
//

import Foundation
import SwiftyJSON

public enum MediaType: String {
    case APPLICATION_JSON = "application/json"
    case APPLICATION_FORM_URLENCODED = "application/x-www-form-urlencoded"
}

public protocol ResponseObjectSerializable: class {
    init?(json: JSON)
}
