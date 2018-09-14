//
//  MozoBasicViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/30/18.
//

import Foundation
import UIKit

public class MozoBasicViewController : UIViewController {
    var coreEventHandler : CoreModuleInterface?
    
    public override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    func addCloseBtn() {
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
        
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(customView: view!)
    }
    
    func loadViewFromNib() -> UIView! {
        let bundle = BundleManager.podBundle()
        let nib = UINib(nibName: "CloseView", bundle: bundle)
        let view = nib.instantiate(withOwner: self, options: nil)[0] as! UIView
        
        return view
    }
    
    @objc func tapCloseBtn() {
        coreEventHandler?.requestForCloseAllMozoUIs()
    }
}
