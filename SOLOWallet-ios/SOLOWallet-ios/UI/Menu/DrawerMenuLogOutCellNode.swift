//
//  DrawerMenuLogOutCellNode.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/28/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import AsyncDisplayKit

fileprivate struct DrawerMenuLogOutCellLayout {
    static let InsetForCell = UIEdgeInsets(top: 12, left: 15, bottom: 12, right: 15)
}

public class DrawerMenuLogOutCellNode: ASCellNode {
    
    private let textNode: ASTextNode = ASTextNode()
    private let verticalTopNode: ASDisplayNode = ASDisplayNode()
    private let verticalBottomNode: ASDisplayNode = ASDisplayNode()
    public override init(){
        super.init()
        
        self.automaticallyManagesSubnodes = true
        self.backgroundColor = UIColor.white
        
        self.textNode.attributedText = NSAttributedString(string: "Log Out", attributes: [ NSAttributedStringKey.foregroundColor: UIColor.red])
        
        self.verticalTopNode.style.height = ASDimension.init(unit: .points, value: 0.5)
        self.verticalTopNode.style.flexGrow = 1.0
        self.verticalTopNode.backgroundColor = ThemeManager.shared.border
        
        self.verticalBottomNode.style.height = ASDimension.init(unit: .points, value: 0.5)
        self.verticalBottomNode.style.flexGrow = 1.0
        self.verticalBottomNode.backgroundColor = ThemeManager.shared.border
    }
    
    override public func layoutSpecThatFits(_ constrainedSize: ASSizeRange) -> ASLayoutSpec {
        
        let  mainSpec = ASStackLayoutSpec.vertical()
        mainSpec.alignItems = .center
        mainSpec.justifyContent = .center
        mainSpec.spacing = 0
        mainSpec.style.width = ASDimensionMakeWithFraction(1)
        mainSpec.children = [self.verticalTopNode,
                             ASInsetLayoutSpec.init(insets: DrawerMenuLogOutCellLayout.InsetForCell, child: self.textNode),
                             self.verticalBottomNode]
        return mainSpec
    }
}
