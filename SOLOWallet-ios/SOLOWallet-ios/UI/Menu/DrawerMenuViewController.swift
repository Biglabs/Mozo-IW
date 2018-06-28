//
//  DrawerMenuViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import AsyncDisplayKit

public class DrawerMenuViewController: UIViewController {
    internal var collectionNode: ASCollectionNode!
    
    public init() {
        super.init(nibName: nil, bundle: nil)
        self.setupViewController()
    }
    
    required public init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        self.setupViewController()
    }
    
    func setupViewController() {
        // setup flowlayout
        // size of each cell width is going to be the size of the screen width
        let flowlayout = UICollectionViewFlowLayout()
        flowlayout.minimumInteritemSpacing  = 0
        flowlayout.minimumLineSpacing       = 0
        flowlayout.scrollDirection = .vertical
        flowlayout.sectionInset = UIEdgeInsets.init(top: 0, left: 0, bottom: 35, right: 0)
        self.collectionNode = ASCollectionNode.init(collectionViewLayout:flowlayout)
    }
    
    public override func viewWillLayoutSubviews() {
        super.viewWillLayoutSubviews()
        
        self.collectionNode.frame = self.view.bounds
    }
    
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        self.view.addSubnode(self.collectionNode)
        
        // setup flowlayout
        self.collectionNode.allowsSelection = true
        self.collectionNode.dataSource = self
        self.collectionNode.delegate = self
        self.collectionNode.backgroundColor = ThemeManager.shared.menu
        self.forceReload()
    }
    
    public func forceReload() {
        self.collectionNode.reloadData()
    }
}

extension DrawerMenuViewController: ASCollectionDataSource, ASCollectionDelegate {
    public func numberOfSections(in collectionNode: ASCollectionNode) -> Int {
        return 1
    }
    
    public func collectionNode(_ collectionNode: ASCollectionNode, numberOfItemsInSection section: Int) -> Int {
        return 1
    }
    
    public func collectionNode(_ collectionNode: ASCollectionNode, nodeBlockForItemAt indexPath: IndexPath) -> ASCellNodeBlock {
        let nodeBlock: ASCellNodeBlock = { 
            return DrawerMenuLogOutCellNode()
        }
        return nodeBlock
    }
    
    public func collectionNode(_ collectionNode: ASCollectionNode, didSelectItemAt indexPath: IndexPath) {
        self.collectionNode.deselectItem(at: indexPath, animated: true)
        
    }
    
    public func scrollToTop(){
        let indexPath = IndexPath.init(row: 0, section: 0)
        if let _ = collectionNode.nodeForItem(at: indexPath) {
            self.collectionNode.scrollToItem(at: indexPath, at: .top, animated:true)
        }
    }
}
