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
    @IBOutlet weak var btnLogin: UIButton!
    
    //MARK: Customizable from Interface Builder
    @IBInspectable public var showFullBalanceAndAddressDetail: Bool = true {
        didSet {
            displayType = showFullBalanceAndAddressDetail ? .Full : .DetailBalance
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
        // Fix issue: Must include checking user profile in case user profile was loaded failed
        if AccessTokenManager.getAccessToken() == nil
            || SessionStoreManager.loadCurrentUser() == nil {
            isAnonymous = true
        } else {
            isAnonymous = false
        }
        super.loadViewFromNib()
        loadDisplayData()
        setupButtonBorder()
    }
    
    func loadDisplayData() {
        if !isAnonymous {
            print("Load display data.")
            _ = MozoSDK.loadBalanceInfo().done { (item) in
                    print("Receive display data: \(item)")
                    self.updateData(displayItem: item)
                }.catch({ (error) in
                    
                })
        } else {
            switch displayType {
            case .DetailAddress:
                lbTitle.text = "Your Mozo Offchain Wallet Address"
            default: break
            }
            print("Type \(displayType), all target: \(btnLogin.allTargets)")
        }
    }
    
    func setupButtonBorder() {
        if displayType == .NormalAddress {
            let color = !isAnonymous ? ThemeManager.shared.main : ThemeManager.shared.disable
            btnShowQR.layer.borderWidth = 1
            btnShowQR.layer.borderColor = color.cgColor
            btnCopy.layer.borderWidth = 1
            btnCopy.layer.borderColor = color.cgColor
        }
    }
    
    func updateData(displayItem: DetailInfoDisplayItem) {
        if lbBalance != nil {
            lbBalance.text = "\(displayItem.balance)"
        }
        if lbAddress != nil {
            lbAddress.text = displayItem.address
        }
        if imgQR != nil && (displayType == .Full || displayType == .DetailAddress) {
            let qrImg = DisplayUtils.generateQRCode(from: displayItem.address)
            imgQR.image = qrImg
        }
    }
    
    @IBAction func touchCopy(_ sender: Any) {
        UIPasteboard.general.string = lbAddress.text
    }
    
    @IBAction func touchedShowQR(_ sender: Any) {
        print("Touch Show QR code button")
        if let address = lbAddress.text {
            DisplayUtils.displayQRView(address: address)
        }
    }
    @IBAction func touchedLogin(_ sender: Any) {
        print("Touch login button")
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
