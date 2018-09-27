//
//  MozoView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/26/18.
//

import UIKit

@IBDesignable class MozoView: UIView {
    @IBOutlet var containerView: UIView!
    override init(frame: CGRect) {
        super.init(frame: frame)
        loadViewFromNib()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
        loadViewFromNib()
    }
    
    override func prepareForInterfaceBuilder() {
        super.prepareForInterfaceBuilder()
        loadViewFromNib()
    }
    
    func loadView(identifier: String) -> UIView {
        let bundle = BundleManager.mozoBundle()
        let nib = UINib(nibName: identifier, bundle: bundle)
        let view = nib.instantiate(withOwner: self, options: nil)[0] as! UIView
        view.frame = bounds
        view.autoresizingMask = [.flexibleHeight, .flexibleWidth]
        checkDisable()
        return view
    }

    func checkDisable() {
        
    }
    
    func updateView() {
        containerView.removeFromSuperview()
        loadViewFromNib()
        setNeedsLayout()
    }
    
    func loadViewFromNib() {
        if !identifier().isEmpty {
            containerView = loadView(identifier: identifier())
            addSubview(containerView)
        }
    }
    
    func identifier() -> String {
        return ""
    }
}
