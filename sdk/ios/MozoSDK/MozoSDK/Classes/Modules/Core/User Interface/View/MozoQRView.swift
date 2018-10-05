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
    
    @IBAction func touchedCloseBtn(_ sender: Any) {
        coverView.removeFromSuperview()
        self.removeFromSuperview()
    }
}
