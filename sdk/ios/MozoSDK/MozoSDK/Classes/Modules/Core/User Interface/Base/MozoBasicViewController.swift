//
//  MozoBasicViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/30/18.
//

import Foundation
import UIKit

public class MozoBasicViewController : UIViewController {
    public override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationItem.hidesBackButton = true
    }
    
    public override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        if UIDevice.current.userInterfaceIdiom == .pad {
            return UIInterfaceOrientationMask.portrait
        }
        return UIInterfaceOrientationMask.all
    }
    
    public override var shouldAutorotate: Bool {
        if UIDevice.current.userInterfaceIdiom == .pad {
            return false
        }
        return true
    }
    
    func enableBackBarButton() {
        self.navigationController?.navigationBar.backItem?.title = "Back"
        navigationItem.hidesBackButton = false
    }
    
    func displayMozoError(_ error: String) {
        let alert = UIAlertController(title: "Error", message: error, preferredStyle: .alert)
        alert.addAction(.init(title: "OK", style: .default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
}
