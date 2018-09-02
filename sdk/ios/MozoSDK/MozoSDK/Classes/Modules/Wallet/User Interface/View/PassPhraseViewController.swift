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
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    @IBOutlet fileprivate var navigationBar:UINavigationBar?
    @IBOutlet weak var walletBackupPassphraseLabel: UILabel!
    @IBOutlet fileprivate var  backupPassphraseExplanation:UILabel?
    @IBOutlet fileprivate var passPhraseTextView:UITextView?
    @IBOutlet fileprivate var masterSeedHexTitleLabel:UILabel?
    @IBOutlet fileprivate var masterSeedHexTitleExplanation:UILabel?
    @IBOutlet fileprivate var masterSeedHexTextView:UITextView?
    
    override var preferredStatusBarStyle : (UIStatusBarStyle) {
        return UIStatusBarStyle.lightContent
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.passPhraseTextView!.isSelectable = false
        self.masterSeedHexTextView!.isSelectable = false
        let passPhraseTextViewGestureRecognizer = UITapGestureRecognizer(target: self, action:#selector(self.passPhraseTextViewTapped(_:)))
        self.passPhraseTextView!.addGestureRecognizer(passPhraseTextViewGestureRecognizer)
        let masterSeedHexGestureRecognizer = UITapGestureRecognizer(target:self, action:#selector(self.masterSeedHexTextViewTapped(_:)))
        self.masterSeedHexTextView!.addGestureRecognizer(masterSeedHexGestureRecognizer)
        
        // Generate mnemonic
        eventHandler?.generateMnemonics()

        self.masterSeedHexTitleLabel!.isHidden = true
        self.masterSeedHexTitleExplanation!.isHidden = true
        self.masterSeedHexTextView!.isHidden = true
        self.masterSeedHexTextView!.text = ("")
    }
    
    @objc func passPhraseTextViewTapped(_ sender:AnyObject) {
    }
    
    @objc func masterSeedHexTextViewTapped(_ sender:AnyObject) {
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction fileprivate func cancel(_ sender:AnyObject) {
        
    }
}

extension PassPhraseViewController: PassPhraseViewInterface {
    func showPassPhrase(passPharse: String) {
        self.passPhraseTextView?.text = passPharse
    }
    
    
}
