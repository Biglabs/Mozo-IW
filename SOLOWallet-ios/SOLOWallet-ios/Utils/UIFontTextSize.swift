//
//  UIFontTextSize.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import Foundation
import UIKit

//ref https://developer.apple.com/ios/human-interface-guidelines/visual-design/typography/

public struct UIFontTextSize {
    
    public init(_ type: TypeSize) {
        switch type {
        case .xSmall:
            largetitle = 31
            title1 = 25
            title2 = 19
            title3 = 17
            headline = 14
            body = 14
            callout = 13
            subhead = 12
            footnote = 12
            caption1 = 11
            caption2 = 11
        case .small:
            largetitle = 32
            title1 = 26
            title2 = 20
            title3 = 18
            headline = 15
            body = 15
            callout = 14
            subhead = 13
            footnote = 12
            caption1 = 11
            caption2 = 11
        case .medium:
            largetitle = 33
            title1 = 27
            title2 = 21
            title3 = 19
            headline = 16
            body = 16
            callout = 15
            subhead = 14
            footnote = 12
            caption1 = 11
            caption2 = 11
        case .xLarge:
            largetitle = 34
            title1 = 28
            title2 = 22
            title3 = 20
            headline = 17
            body = 17
            callout = 16
            subhead = 15
            footnote = 13
            caption1 = 12
            caption2 = 11
        default:
            largetitle = 31
            title1 = 25
            title2 = 19
            title3 = 17
            headline = 14
            body = 14
            callout = 13
            subhead = 12
            footnote = 12
            caption1 = 11
            caption2 = 11
        }
        
    }
    
    public let largetitle: CGFloat
    public let title1: CGFloat
    public let title2: CGFloat
    public let title3: CGFloat
    public let headline: CGFloat
    public let subhead: CGFloat
    public let body: CGFloat
    public let callout: CGFloat
    public let footnote: CGFloat
    public let caption1: CGFloat
    public let caption2: CGFloat
    public let style: NSMutableParagraphStyle = {
        let style = NSMutableParagraphStyle.init()
        style.paragraphSpacing = 12.0
        style.lineHeightMultiple = 0.0
        style.hyphenationFactor = 0.0
        return style
    }()
    public let ligature: CGFloat = 1
    public let kern: CGFloat = 0
}


public enum TypeSize {
    case xSmall
    case small
    case medium
    case large
    case xLarge
    case xxLarge
    case xxxLarge
}
