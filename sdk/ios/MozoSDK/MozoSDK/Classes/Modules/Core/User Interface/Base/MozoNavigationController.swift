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
        for viewController in self.viewControllers {
            if viewController.navigationItem.rightBarButtonItem == nil {
                addCloseBtn(item: viewController.navigationItem)
            }
        }
    }
    
    func addCloseBtn(item: UINavigationItem) {
        print("Add close button.")
        let view = loadViewFromNib()
        
        //        let titleLabel = UILabel.init()
        //        titleLabel.font = UIFont.boldSystemFont(ofSize: 16)
        //        titleLabel.textColor = ThemeManager.shared.title
        //        let icon = UIImage.init(named: "ic_close")!
        //        titleLabel.addTextWithImage(text: NSLocalizedString("Close", comment: "Close"), image: icon, imageBehindText: false, keepPreviousText: true)
        
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
