//
//  DemoViewController.swift
//  Shopper
//
//  Created by Hoang Nguyen on 8/16/18.
//  Copyright © 2018 Hoang Nguyen. All rights reserved.
//

import UIKit
import MozoSDK

class DemoViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        navigationItem.title = "DEMO COMPONENTS"
        MozoSDK.authenticate()
        MozoSDK.setAuthDelegate(self)
//        MozoSDK.transferMozo()
//        let hash = "000000".toSHA512()
//        print("Pin hashed: \(hash)")
//        let en = "test pizza drift whip rebel empower flame mother service grace sweet kangaroo".encrypt(key: "000000")
//        print("Encrypt seed words: \(en)")
//        print(en.decrypt(key: "000000"))
//          let de = "AwHWZMfL6DJVw6K2JJoEPSLNnEuihX34SsSGxGbjSFnN6rPsuCPDMdyEST8zlENTErtbn5qFSgLFULoBKGhCBL780j1EUwA+F8MNgbsx08+UGB7tPvh69U8Fc5wNMKlBljc="
//        "AwHKcoMId0W8pKckaY964+Ck1r2eE+2+Bne9o0+UFZEm2GkeD1UnIxPLEgg2UYhEo+deCSU7RszkpNiwnRZrJYzk2sCoEv86Ubb3Zdm6cIOlxpJLR+n10WyYg9ntkenB2UbJvcy++KpKPbrPU4hEX1MP3wG37dNXcGn8pjZ0bnLJ23IspS8eMqZubHL53pRC2XU="
//        //"AgH30s0LsXZ6wNXZIs0+CfdNgjPAqNq5j9yd0pwT+cHaQ0gtJYD+L5achFnzeZ2du2l4iLw9t6ecwJ0qgWJ1C2Bu5UZ9PYqso5BoNapHvdU2ej+dkZlH35eB3j399bI8vP0ADuDRVNKno9xIHkuf1XCrFJBU/dxyw30mQpD1Y17xBI9IuJebGhtvCW0JWMDslZI="
//        //        AwHj5kZFQvaI9MdZ4ypl51Poa1zqqn1ZoPFT00WWuDmzLmmLeR/adtx1NVX1J4KYQTtDXJ95el2GirwtNEAt3P55dR0PafT/UeGl472JYKlWXsTFh7WQZhyr4aU0/1Re8HdUBC4oxoT6hlwi4NJb4WjCCw+JgfkwImysRzQ51BmKUj8KiOK1QKdJsLu15VQKrQA=
//        let decrypted = de.decrypt(key: "000000")
//        print("Decrypted: \(decrypted)")
    }
    
    @IBAction func transferTapped(_ sender: Any) {
        MozoSDK.transferMozo()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}

extension DemoViewController: AuthenticationDelegate {
    func mozoAuthenticationDidFinish() {
        print("Mozo: Finish authentication")
        let alert = UIAlertController(title: "MOZO", message: "Finish authentication", preferredStyle: .alert)
        alert.addAction(.init(title: "OK", style: .default) {(action) in
            
        })
        self.present(alert, animated: true, completion: nil)
    }
    
    func mozoLogoutDidFinish() {
        print("Mozo: Finish logout")
    }
    
    func mozoUIDidCloseAll() {
        print("Mozo: Did close all UIs")
    }
}
