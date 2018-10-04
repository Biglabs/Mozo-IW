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
    
    func enableBackBarButton() {
        self.navigationController?.navigationBar.backItem?.title = "Back"
        navigationItem.hidesBackButton = false
    }
    
    func displayMozoError(_ error: String) {
        let alert = UIAlertController(title: "Error", message: error, preferredStyle: .alert)
        alert.addAction(.init(title: "OK", style: .default, handler: nil))
        self.present(alert, animated: true, completion: nil)
    }
    
    // MARK: Spinner
    var mozoSpinnerView : UIView?
    
    func displayMozoSpinner() {
        navigationItem.hidesBackButton = true
        mozoSpinnerView = UIView.init(frame: self.view.bounds)
        mozoSpinnerView?.backgroundColor = UIColor.init(red: 0.5, green: 0.5, blue: 0.5, alpha: 0.5)
        let ai = UIActivityIndicatorView.init(activityIndicatorStyle: .whiteLarge)
        ai.startAnimating()
        ai.center = (mozoSpinnerView?.center)!
        
        DispatchQueue.main.async {
            self.mozoSpinnerView?.addSubview(ai)
            self.view.addSubview(self.mozoSpinnerView!)
        }
    }
    
    func removeMozoSpinner() {
        DispatchQueue.main.async {
            self.navigationItem.hidesBackButton = false
            self.mozoSpinnerView?.removeFromSuperview()
        }
    }
}
