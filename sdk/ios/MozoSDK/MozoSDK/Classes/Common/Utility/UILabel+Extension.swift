//
//  UILabel+Extension.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/14/18.
//

import UIKit

extension UILabel {
    
    /**
     This function adding image with text on label.
     
     - parameter text: The text to add
     - parameter image: The image to add
     - parameter imageBehindText: A boolean value that indicate if the imaga is behind text or not
     - parameter keepPreviousText: A boolean value that indicate if the function keep the actual text or not
     */
    func addTextWithImage(text: String, image: UIImage, imageBehindText: Bool, keepPreviousText: Bool) {
        let lAttachment = NSTextAttachment()
        lAttachment.image = image
        
        // 1pt = 1.32px
        let lFontSize = round(self.font.pointSize * 1.32)
        let lRatio = image.size.width / image.size.height
        if imageBehindText {
            lAttachment.bounds = CGRect(x: 0, y: 3, width: 6, height: 6)
        } else {
            lAttachment.bounds = CGRect(x: 0, y: ((self.font.capHeight - lFontSize) / 2).rounded(), width: lRatio * lFontSize, height: lFontSize)
        }
        
        let lAttachmentString = NSAttributedString(attachment: lAttachment)
        
        if imageBehindText {
            let lStrLabelText: NSMutableAttributedString
            
            if keepPreviousText, let lCurrentAttributedString = self.attributedText {
                lStrLabelText = NSMutableAttributedString(attributedString: lCurrentAttributedString)
                lStrLabelText.append(NSMutableAttributedString(string: text))
            } else {
                lStrLabelText = NSMutableAttributedString(string: text)
            }
            
            lStrLabelText.append(lAttachmentString)
            self.attributedText = lStrLabelText
        } else {
            let lStrLabelText: NSMutableAttributedString
            
            if keepPreviousText, let lCurrentAttributedString = self.attributedText {
                lStrLabelText = NSMutableAttributedString(attributedString: lCurrentAttributedString)
                lStrLabelText.append(NSMutableAttributedString(attributedString: lAttachmentString))
                lStrLabelText.append(NSMutableAttributedString(string: text))
            } else {
                lStrLabelText = NSMutableAttributedString(attributedString: lAttachmentString)
                lStrLabelText.append(NSMutableAttributedString(string: text))
            }
            
            self.attributedText = lStrLabelText
        }
    }
    
    /**
     This function adding text with different color on label after current text.
     
     - parameter text: The text to add
     - parameter color: The color of the text
     */
    func addTextWithColor(text: String, color: UIColor) {
        let lStrLabelText: NSMutableAttributedString
        let finalText = (self.text ?? "") + text
        let finalStr = NSAttributedString(string: finalText)
        lStrLabelText = NSMutableAttributedString(attributedString: finalStr)
        let range = NSRange(location: (self.text?.count)!, length: text.count)
        
        lStrLabelText.addAttribute(NSAttributedStringKey.foregroundColor, value: color, range: range)
        
        self.attributedText = lStrLabelText
    }
    
    func removeImage() {
        let text = self.text
        self.attributedText = nil
        self.text = text
    }
}
