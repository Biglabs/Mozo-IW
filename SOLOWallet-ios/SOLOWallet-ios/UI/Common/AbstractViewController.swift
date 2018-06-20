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
    
    var coin: CoinDTO!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        //dummy data
        coin = CoinDTO.init(id: 0, key: "BTC", name: "BTC", icon: "ic_bitcoin", addesses: [AddressDTO.init(id: "123321", age: 1415637900, balance: 7.320)!])
        
        let navigationBar: UINavigationBar = UINavigationBar(frame: CGRect(x: 0, y: UIApplication.shared.statusBarFrame.height, width: self.view.frame.width, height: 44))
        self.view.addSubview(navigationBar)
        
        self.menuBarButton = UIBarButtonItem.init(image: UIImage.init(named: "ic_menu"), style: .plain, target: self, action: #selector(self.rightDrawerButtonPress(_:)))
        self.logoBarButton = UIBarButtonItem.init(title: "Solo", style: .plain, target: self, action: nil)
        self.logoBarButton.tintColor = ThemeManager.shared.main
        
        let navItem = UINavigationItem(title: coin.name!)
        navItem.rightBarButtonItem = self.menuBarButton
        navItem.leftBarButtonItem = self.logoBarButton
        navItem.titleView = UIImageView.init(image: UIImage.init(named: coin.icon!))
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
