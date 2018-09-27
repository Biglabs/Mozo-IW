//
//  MozoBalanceView.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/18/18.
//

import Foundation

@IBDesignable class MozoBalanceView : MozoView {
    @IBOutlet weak var lbTitle: UILabel!
    @IBOutlet weak var lbBalance: UILabel!
    @IBOutlet weak var lbBalanceExchange: UILabel!
    @IBOutlet weak var lbAddress: UILabel!
    @IBOutlet weak var btnCopy: UIButton!
    @IBOutlet weak var imgQR: UIImageView!
    @IBOutlet weak var btnShowQR: UIButton!
    
    //MARK: Customizable from Interface Builder
    @IBInspectable public var showFullBalanceAndAddressDetail: Bool = true {
        didSet {
            displayType = .Full
            updateView()
        }
    }
    
    @IBInspectable public var showOnlyBalanceDetail: Bool = false {
        didSet {
            displayType = showOnlyBalanceDetail ? .DetailBalance : .NormalBalance
            updateView()
        }
    }
    
    @IBInspectable public var showOnlyAddressDetail: Bool = false {
        didSet {
            displayType = showOnlyAddressDetail ? .DetailAddress : .NormalAddress
            updateView()
        }
    }
    var displayType: BalanceDisplayType = BalanceDisplayType.Full
    var isAnonymous: Bool = false
    
    override func identifier() -> String {
        return isAnonymous ? displayType.anonymousId : displayType.id
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        setBorder()
    }
    
    func setBorder() {
        layer.borderWidth = 0.5
        layer.borderColor = ThemeManager.shared.borderInside.cgColor
    }
    
    override func loadViewFromNib() {
        if AccessTokenManager.getAccessToken() == nil {
            isAnonymous = true
        } else {
            isAnonymous = false
        }
        super.loadViewFromNib()
        loadDisplayData()
    }
    
    func loadDisplayData() {
        if !isAnonymous {
            print("Load display data.")
            let item = DetailInfoDisplayItem(balance: 0.0, address: "")
            updateData(displayItem: item)
            _ = MozoSDK.loadBalanceInfo().done { (item) in
                    print("Receive display data: \(item)")
                    self.updateData(displayItem: item)
                }.catch({ (error) in
                    
                })
        }
    }
    
    func updateData(displayItem: DetailInfoDisplayItem) {
        if lbBalance != nil {
            lbBalance.text = "\(displayItem.balance)"
            lbAddress.text = displayItem.address
            let qrImg = DisplayUtils.generateQRCode(from: displayItem.address)
            imgQR.image = qrImg
        }
    }
    
    @IBAction func touchCopy(_ sender: Any) {
        UIPasteboard.general.string = lbAddress.text
    }
    
    @IBAction func touchedShowQR(_ sender: Any) {
        
    }
    @IBAction func touchedLogin(_ sender: Any) {
        MozoSDK.authenticate()
        MozoSDK.setAuthDelegate(self)
    }
}

extension MozoBalanceView : AuthenticationDelegate {
    func mozoAuthenticationDidFinish() {
        updateView()
    }
    
    func mozoLogoutDidFinish() {
        
    }
    
    func mozoUIDidCloseAll() {
    }
}
