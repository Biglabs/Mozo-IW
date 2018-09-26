//
//  MozoView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import UIKit

class MozoView: UIView {
    func loadView(identifier: String) -> UIView {
        let bundle = BundleManager.mozoBundle()
        let nib = UINib(nibName: identifier, bundle: bundle)
        return nib.instantiate(withOwner: self, options: nil)[0] as! UIView
    }
}
