//
//  MediaType.swift
//  SoloSDK
//
//  Created by Tam Nguyen on 6/29/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

public enum MediaType: String {
    case APPLICATION_JSON = "application/json"
    case APPLICATION_FORM_URLENCODED = "application/x-www-form-urlencoded"
}

//completions
public typealias completion = ((_ value: Any?, _ error: Error?) -> Void)?
public typealias completionProgress = ((_ value: Any?, _ progress: Progress?, _ error: Error?) -> Void)?
