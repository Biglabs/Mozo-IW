//
//  MozoQRView.swift
//  MozoSDK
//
//  Created by HoangNguyen on 9/30/18.
//

import Foundation
class MozoQRView : MozoView {
    @IBOutlet weak var imgQR: UIImageView!
    weak var coverView: UIView!
    @IBOutlet weak var imgContainerView: UIView!
    @IBOutlet weak var btnClose: UIButton!
    
    var qrImage : UIImage? {
        didSet {
            loadImageData()
        }
    }
    
    override func identifier() -> String {
        return "MozoQRView"
    }
    
    func loadImageData() {
        if let img = qrImage {
            imgQR.image = img
        }
    }
    
    override func loadViewFromNib() {
        super.loadViewFromNib()
        setBorders()
    }
    
    func setBorders() {
        imgContainerView.layer.borderWidth = 1.2
        imgContainerView.layer.borderColor = ThemeManager.shared.disable.cgColor
        imgContainerView.layer.cornerRadius = 0.02 * imgContainerView.bounds.size.width
        btnClose.layer.borderWidth = 1
        btnClose.layer.cornerRadius = 0.02 * btnClose.bounds.size.width
        btnClose.layer.borderColor = UIColor.clear.cgColor
    }
    
    @IBAction func touchedCloseBtn(_ sender: Any) {
        coverView.removeFromSuperview()
        self.removeFromSuperview()
    }
}
