# Mozo SDK for iOS
[![Release](https://img.shields.io/github/release/aws/aws-sdk-ios.svg)]()
[![CocoaPods](https://img.shields.io/cocoapods/v/AWSiOSSDKv2.svg)]()

This open-source library allows you to integrate Mozo supported features into your iOS app.

Learn more about the provided samples, documentation, integrating the SDK into your app, accessing source code, and more at https://developer.mozocoin.io/docs

## Setting Up

To get started with the AWS SDK for iOS, check out the [Mozo Mobile Developer Guide for iOS](https://developer.mozocoin.io/docs/mozo-mobile/latest/developerguide/getting-started.html). You can set up the SDK and start building a new project, or you integrate the SDK in an existing project. You can also run the samples to get a sense of how the SDK works.

To use the Mozo SDK for iOS, you will need the following installed on your development machine:

* Xcode 9 or later
* iOS 10 or later

At the Mozo GitHub repo, you can check out the [SDK source code](https://github.com/biglabs/mozo-ios-sdk).

## Requirements

With iOS 10 and higher you need to add some keys to the Info.plist of your project. This should be found in 'your_project/ios/your_project/Info.plist'.
1. The "Privacy - Camera Usage Description" key. Add the following code:
```
<key>NSCameraUsageDescription</key>
<string>Enable camera feature to scan QR Code.</string>
```
2. The "Privacy - Location Always Usage Description" key.
```
<key>NSLocationAlwaysUsageDescription</key>
<string></string>
```
3. The "Privacy - Bluetooth Peripheral Usage Description" key.
```
<key>NSBluetoothPeripheralUsageDescription</key>
<string></string>
```

### Standard pod install

Go to
[https://developer.mozocoin.io/docs/ios/setup](https://developer.mozocoin.io/docs/ios/setup).

## Include the SDK for iOS in an Existing Application

The [samples](https://github.com/biglabs/mozo-ios-sdk/Examples) included with the SDK for iOS are standalone projects that are already set up for you. You can also integrate the SDK for iOS with your own existing project. Below is how to import the Mozo Mobile SDK for iOS into your project:

* [CocoaPods](https://cocoapods.org/)

1. The Mozo Mobile SDK for iOS is available through [CocoaPods](http://cocoapods.org). If you have not installed CocoaPods, install CocoaPods by running the command:

$ gem install cocoapods
$ pod setup

Depending on your system settings, you may have to use `sudo` for installing `cocoapods` as follows:

$ sudo gem install cocoapods
$ pod setup

2. In your project directory (the directory where your `*.xcodeproj` file is), create a plain text file named `Podfile` (without any file extension) and add the lines below. Replace `YourTarget` with your actual target name.

source 'https://github.com/CocoaPods/Specs.git'

platform :ios, '10.0'
use_frameworks!

target :'YourTarget' do
pod 'MozoSDK'
end

![image](readme-images/cocoapods-setup-01.png?raw=true)

3. Then run the following command:

$ pod install

4. Open up `*.xcworkspace` with Xcode and start using the SDK.

![image](readme-images/cocoapods-setup-02.png?raw=true)

**Note**: Do **NOT** use `*.xcodeproj`.

## Getting Started with Swift

1. Import the AWSCore header in the application delegate.

```swift
import MozoSDK
```

2. Create a default service configuration by adding the following code snippet in the `application:didFinishLaunchingWithOptions:` application delegate method.

```swift
MozoSDK.configure()
```
or you can create a specific configuration for your company through registered api key:

```swift
MozoSDK.configure(apiKey: "YOUR API KEY")
```
and your target network:

```swift
MozoSDK.configure(apiKey: "YOUR API KEY", network: NetworkType.MainNet)
```

3. In Swift file you want to use the SDK, import the MozoSDK headers for the services you are using. The header file import convention is `import MozoSDK`, as in the following examples:

```swift
import MozoSDK
```
4. Request MozoSDK for authentication:

```swift
MozoSDK.authenticate()
```

5. Request MozoSDK for transfer:

```swift
MozoSDK.transferMozo()
```

6. Request MozoSDK for transaction history:

```swift
MozoSDK.displayTransactionHistory()
```

## Getting Started with Objective-C

1. Import the MozoSDK header in the application delegate.

```objective-c
@import MozoSDK;
```

2. Create a default service configuration by adding the following code snippet in the `application:didFinishLaunchingWithOptions:` application delegate method.

```objective-c
[MozoSDK configure];
```

3. Import the MozoSDK headers for the services you are using. The header file import convention is `@import MozoSDK;`, as in the following examples:

```objective-c
@import MozoSDK;
```

## FEATURES

- Login - <https://developer.mozocoin.io/docs/mozo-login>
- Wallet Management - <https://developer.mozocoin.io/docs/wallet-management>
- UI Components - <https://developer.mozocoin.io/docs/ui-components>
- Transfer Mozo Offchain - <https://developer.mozocoin.io/docs/transfer-mozo-offchain>
- Transaction History - <https://developer.mozocoin.io/docs/transaction-history>
- Address Book - <https://developer.mozocoin.io/docs/address-book>

## GIVE FEEDBACK

Please report bugs or issues to <https://developer.mozocoin.io/bugs/>

## LICENSE

See the [LICENSE](LICENSE) file.

