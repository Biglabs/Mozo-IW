//
//  Callbacks.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/22/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation

//completions
public typealias completion = ((_ value: Any?, _ error: Error?) -> Void)?
public typealias completionProgress = ((_ value: Any?, _ progress: Progress?, _ error: Error?) -> Void)?

//typealias callback
public typealias VoidCallback = (() -> Void)?
public typealias ValueCallback = ((_ value: Any?) -> Void)?
