//
//  ScannerViewController.swift
//  MozoSDK
//
//  Created by Hoang Nguyen on 9/19/18.
//

import Foundation
import AVFoundation
import UIKit

class ScannerViewController: MozoBasicViewController, AVCaptureMetadataOutputObjectsDelegate {
    var eventHandler : TransactionModuleInterface?
    var captureSession: AVCaptureSession!
    var previewLayer: AVCaptureVideoPreviewLayer!

    override func viewDidLoad() {
        super.viewDidLoad()

        view.backgroundColor = .black
        captureSession = AVCaptureSession()

        guard let videoCaptureDevice = AVCaptureDevice.default(for: .video) else { return }
        let videoInput: AVCaptureDeviceInput

        do {
            videoInput = try AVCaptureDeviceInput(device: videoCaptureDevice)
        } catch {
            return
        }

        if (captureSession.canAddInput(videoInput)) {
            captureSession.addInput(videoInput)
        } else {
            failed()
            return
        }

        let metadataOutput = AVCaptureMetadataOutput()

        if (captureSession.canAddOutput(metadataOutput)) {
            captureSession.addOutput(metadataOutput)

            metadataOutput.setMetadataObjectsDelegate(self, queue: DispatchQueue.main)
            metadataOutput.metadataObjectTypes = [.qr]
        } else {
            failed()
            return
        }

        previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
        previewLayer.frame = view.layer.bounds
        previewLayer.videoGravity = .resizeAspectFill
        view.layer.addSublayer(previewLayer)

        captureSession.startRunning()
        
        self.createBackButton()
    }

    func createBackButton() {
        let frame = CGRect(x: 19, y: view.frame.size.height - 27, width: 65, height: 18)
        let backView = UIView(frame: frame)
        
        let imageFrame = CGRect(x: 0, y: 0, width: 19, height: 15)
        let imageView = UIImageView(frame: imageFrame)
        imageView.image = UIImage(named: "ic_left_arrow_white", in: BundleManager.mozoBundle(), compatibleWith: nil)
        backView.addSubview(imageView)
        
        let lbFrame = CGRect(x: imageFrame.size.width + 9, y: 0, width: 36, height: 18)
        let label = UILabel(frame: lbFrame)
        label.text = "Back"
        label.font = UIFont.systemFont(ofSize: 15)
        label.textColor = .white
        backView.addSubview(label)
        
        backView.backgroundColor = .clear
        view.addSubview(backView)
        
        let tap = UITapGestureRecognizer(target: self, action: #selector(self.back))
        tap.numberOfTapsRequired = 1
        backView.isUserInteractionEnabled = true
        backView.addGestureRecognizer(tap)
    }

    func failed() {
        let ac = UIAlertController(title: "Scanning not supported", message: "Your device does not support scanning a code from an item. Please use a device with a camera.", preferredStyle: .alert)
        ac.addAction(UIAlertAction(title: "OK", style: .default))
        present(ac, animated: true)
        captureSession = nil
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

        if (captureSession?.isRunning == false) {
            captureSession.startRunning()
        }
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

        if (captureSession?.isRunning == true) {
            captureSession.stopRunning()
        }
    }

    func metadataOutput(_ output: AVCaptureMetadataOutput, didOutput metadataObjects: [AVMetadataObject], from connection: AVCaptureConnection) {
        captureSession.stopRunning()

        if let metadataObject = metadataObjects.first {
            guard let readableObject = metadataObject as? AVMetadataMachineReadableCodeObject else { return }
            guard let stringValue = readableObject.stringValue else { return }
            AudioServicesPlaySystemSound(SystemSoundID(kSystemSoundID_Vibrate))
//            self.delegate?.updateValue("qrcode", value: stringValue)
            self.back()
        }

        dismiss(animated: true)
    }

    @objc func back() {
        self.dismiss(animated: true)
    }

    override var prefersStatusBarHidden: Bool {
        return true
    }
}
