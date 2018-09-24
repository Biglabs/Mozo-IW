#
#  Be sure to run `pod spec lint MozoSDK.podspec' to ensure this is a
#  valid spec and to remove all comments including this before submitting the spec.
#
#  To learn more about Podspec attributes see http://docs.cocoapods.org/specification.html
#  To see working Podspecs in the CocoaPods repo see https://github.com/CocoaPods/Specs/
#

Pod::Spec.new do |s|

  s.name         = "MozoSDK"
  s.version      = "0.0.1"
  s.summary = 'Mozo protocol toolkit for Swift'
  s.description = <<-DESC
                        The Mozo SDK is a Swift implementation of the Mozo protocol. This SDK was originally made by Hoang Nguyen. It allows maintaining authentication/authorization with Mozo Services, receiving Mozo lucky coins via beacons and buying/selling/transferring Mozo. It is also supporting UI components for authentication and buying/selling/transferring Mozo.
                        ```
                    DESC

  s.homepage         = 'https://www.mozocoin.io/'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Mozo developers' => 'developer@mozocoin.io' }
  s.source           = { :git => 'https://github.com/Biglabs/Mozo-IW.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.swift_version = '4.1'
  s.ios.deployment_target = '10.0'

  s.source_files  = "MozoSDK/Classes/**/*.{swift}"
  
  s.resources = ['MozoSDK/Classes/**/*.xcdatamodeld']
  s.resource_bundles = {
      'MozoSDK' => ['MozoSDK/Classes/**/*.{storyboard,xib}',
                    'MozoSDK/Assets/*.xcassets',
                    'MozoSDK/Localization/*.lproj']
  }

  s.preserve_path = 'module.map'
  s.prepare_command = <<-CMD
  cat > "module.map" << MAP
  module AppAuth [system] {
      header "${PODS_ROOT}/AppAuth/Source/AppAuth.h"
      link "AppAuth"
      export *
  }
  MAP
  CMD

   s.dependency 'SwiftyJSON', '~> 3.1.4'
  # s.dependency 'EstimoteSDK'
  s.dependency 'web3swift', '~> 1.1.1'
  s.dependency 'secp256k1_ios', '~> 0.1'
  s.dependency 'BigInt', '~> 3.1'
  s.dependency 'RNCryptor', '~> 5.0.3'
  s.dependency 'PromiseKit/Alamofire', '~> 6.0'
  s.dependency 'CoreStore', '5.1.1'
  s.dependency 'AppAuth', '~> 0.92.0'
end
