//
//  ReceiveTransactionValueCell.swift
//  SOLOWallet-ios
//
//  Created by Hoang Nguyen on 7/19/18.
//  Copyright © 2018 biglabs. All rights reserved.
//

import UIKit

public class ReceiveTransactionValueCell: UITableViewCell {
    @IBOutlet weak var inputCoinView: UIView!
    @IBOutlet weak var coinBackgroundView: UIView!
    @IBOutlet weak var inputCoinIconLabel: UILabel!
    @IBOutlet weak var inputCoinNameLabel: UILabel?
    @IBOutlet weak var inputCoinTextField: UITextField!
    @IBOutlet weak var inputUSDLabel: UILabel?
    
    private var coin: AddressDTO?
    
    public override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        self.inputCoinView.layer.cornerRadius = 5
        self.inputCoinView.layer.borderColor = ThemeManager.shared.border.cgColor
        self.inputCoinView.layer.borderWidth = 0.5
        self.coinBackgroundView.backgroundColor = ThemeManager.shared.title
        self.coinBackgroundView.roundCorners(corners: [.topLeft, .bottomLeft], radius: 5)
        self.inputCoinIconLabel.backgroundColor = ThemeManager.shared.title
        self.inputCoinIconLabel.textColor = UIColor.white
        self.inputCoinIconLabel.addTextWithImage(text: "", image: UIImage.init(named: "ic_sort_ascending")!, imageBehindText: true, keepPreviousText: false)
        self.inputCoinIconLabel.roundCorners(corners: [.topLeft, .bottomLeft], radius: 5)
        self.inputCoinNameLabel?.backgroundColor = ThemeManager.shared.title
        self.inputCoinNameLabel?.textColor = UIColor.white
        self.inputCoinTextField.textColor = ThemeManager.shared.font
        self.inputCoinTextField.keyboardType = UIKeyboardType.decimalPad
        self.inputCoinTextField.addTarget(self, action: #selector(self.textFieldDidChange(_:)), for: .editingChanged)
        self.inputUSDLabel?.textColor = ThemeManager.shared.placeholder
    }
    
    @objc func textFieldDidChange(_ textField: UITextField) {
        var balance = 0.0
        if let value = textField.text, value != "" {
            balance = Double(value)!
            
        }
        if let usd = self.coin?.usd {
            self.inputUSDLabel?.text = "US$\(Utils.roundDouble(usd*balance))"
        }
    }
    
    public func bindData(_ coin: AddressDTO){
        self.coin = coin
        let coinName = self.coin?.coin ?? ""
        self.inputCoinNameLabel?.text = "\(coinName)   "
    }
}
