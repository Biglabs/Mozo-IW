//
//  AbstractViewController.swift
//  SOLOWallet-ios
//
//  Created by Tam Nguyen on 6/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit
import SideMenu
import MMDrawerController

public class AbstractViewController: UIViewController {
    fileprivate var logoBarButton: UIBarButtonItem!
    fileprivate var menuBarButton: UIBarButtonItem!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        self.automaticallyAdjustsScrollViewInsets = false
        self.navigationController?.navigationBar.isTranslucent = false
        self.tabBarController?.tabBar.isTranslucent = false
        
        let navigationBar: UINavigationBar = UINavigationBar(frame: CGRect(x: 0, y: UIApplication.shared.statusBarFrame.height, width: self.view.frame.width, height: 44))
        
        self.view.addSubview(navigationBar)
        let navItem = UINavigationItem(title: "BTC")
        self.menuBarButton = UIBarButtonItem.init(image: UIImage.init(named: "ic_menu"), style: .plain, target: self, action: #selector(self.rightDrawerButtonPress(_:)))
        navItem.rightBarButtonItem = self.menuBarButton
        
        self.logoBarButton = UIBarButtonItem.init(title: "Solo", style: .plain, target: self, action: nil)
        self.logoBarButton.tintColor = ThemeManager.shared.main
        navItem.leftBarButtonItem = self.logoBarButton
        
        navItem.titleView = UIImageView.init(image: UIImage.init(named: "ic_bitcoin"))
        navigationBar.setItems([navItem], animated: false)
        
        //effect relax
        let doubleTap = UITapGestureRecognizer(target: self, action: #selector(self.doubleTap))
        doubleTap.numberOfTapsRequired = 2
        self.view.addGestureRecognizer(doubleTap)
        
        let twoFingerDoubleTap = UITapGestureRecognizer(target: self, action: #selector(self.twoFingerDoubleTap))
        twoFingerDoubleTap.numberOfTapsRequired = 2
        twoFingerDoubleTap.numberOfTouchesRequired = 2
        self.view.addGestureRecognizer(twoFingerDoubleTap)
    }
    
    @objc open func menuButtonPress(_ sender: Any? = nil) {
        guard let menuVC = SideMenuManager.menuRightNavigationController else {
            return
        }
        menuVC.navigationBar.isTranslucent = false
        self.present(menuVC, animated: true, completion: nil)
    }
    
    @objc open func rightDrawerButtonPress(_ sender: Any? = nil) {
        self.mm_drawerController?.toggle(MMDrawerSide.right, animated: true, completion: nil)
    }
    
    @objc open func doubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    @objc open func twoFingerDoubleTap(_ sender: Any? = nil) {
        self.mm_drawerController?.bouncePreview(for: MMDrawerSide.right) { _ in }
    }
    
    open func refresh(_ sender: Any? = nil) {}
}
