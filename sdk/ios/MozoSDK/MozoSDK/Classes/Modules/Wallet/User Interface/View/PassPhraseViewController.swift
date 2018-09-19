//
//  PassPhraseViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 8/29/18.
//

import Foundation
import UIKit

class PassPhraseViewController: MozoBasicViewController {
    var eventHandler : WalletModuleInterface?
    var passPharse : String? = nil
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    @IBOutlet fileprivate var passPhraseTextView:UITextView?
    @IBOutlet weak var checkView: UIView!
    @IBOutlet weak var checkImg: UIImageView!
    @IBOutlet weak var checkLabel: UILabel!
    @IBOutlet weak var continueBtn: UIButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        addTapForLabel()
        // Generate mnemonic
        eventHandler?.generateMnemonics()
    }
    
    func addTapForLabel() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.checkLabelTapped))
        tap.numberOfTapsRequired = 1
        checkView?.isUserInteractionEnabled = true
        checkView?.addGestureRecognizer(tap)
    }
    
    @objc func checkLabelTapped() {
        if !continueBtn.isEnabled {
            checkLabel.textColor = ThemeManager.shared.main
            continueBtn.isEnabled = true
            continueBtn.backgroundColor = ThemeManager.shared.main
            checkImg.isHighlighted = true
        }
    }
    
    @IBAction fileprivate func continueBtnTapped(_ sender:AnyObject) {
        if let passPhrase = self.passPharse {
            eventHandler?.skipShowPassPharse(passPharse: passPhrase)
        }
    }
    
    func addWordSpace(str: String) -> String {
        return str.replace(" ", withString: "  ")
    }
}

extension PassPhraseViewController: PassPhraseViewInterface {
    func showPassPhrase(passPharse: String) {
        self.passPharse = passPharse
        self.passPhraseTextView?.text = addWordSpace(str: passPharse)
    }
}
