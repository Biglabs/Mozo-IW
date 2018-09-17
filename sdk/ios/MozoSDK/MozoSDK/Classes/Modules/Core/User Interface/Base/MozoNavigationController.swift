//
//  MozoNavigationController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/30/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import Foundation
import UIKit

public class MozoNavigationController : UINavigationController {
    var coreEventHandler : CoreModuleInterface?
    
    public override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    public override func setViewControllers(_ viewControllers: [UIViewController], animated: Bool) {
        super.setViewControllers(viewControllers, animated: animated)
        scanAllViewControllers()
    }
    
    func scanAllViewControllers() {
        print("Mozo Navigation Controller, scan all view controllers")
        for viewController in self.viewControllers {
            // TODO: Apply translation according to localizaion
            print("Controller title: \(viewController.navigationItem.title ?? "DEFAULT")")
            if viewController.navigationItem.rightBarButtonItem == nil {
                addCloseBtn(item: viewController.navigationItem)
            }
        }
    }
    
    func addCloseBtn(item: UINavigationItem) {
        print("Add close button.")
        let view = loadViewFromNib()
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.tapCloseBtn))
        tap.numberOfTapsRequired = 1
        view?.isUserInteractionEnabled = true
        view?.addGestureRecognizer(tap)
    
        item.rightBarButtonItem = UIBarButtonItem(customView: view!)
    }
    
    func loadViewFromNib() -> UIView! {
        let bundle = BundleManager.mozoBundle()
        let nib = UINib(nibName: "CloseView", bundle: bundle)
        let view = nib.instantiate(withOwner: self, options: nil)[0] as! UIView
        
        return view
    }
    
    @objc func tapCloseBtn() {
        coreEventHandler?.requestForCloseAllMozoUIs()
    }
}
