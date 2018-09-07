#
#  Be sure to run `pod spec lint MozoSDK.podspec' to ensure this is a
#  valid spec and to remove all comments including this before submitting the spec.
#
#  To learn more about Podspec attributes see http://docs.cocoapods.org/specification.html
#  To see working Podspecs in the CocoaPods repo see https://github.com/CocoaPods/Specs/
#

Pod::Spec.new do |s|

  # ―――  Spec Metadata  ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  These will help people to find your library, and whilst it
  #  can feel like a chore to fill in it's definitely to your advantage. The
  #  summary should be tweet-length, and the description more in depth.
  #

  s.name         = "MozoSDK"
  s.version      = "0.0.1"
  s.summary = 'Mozo protocol toolkit for Swift'
  s.description = <<-DESC
                        The Mozo SDK is a Swift implementation of the Mozo protocol. This SDK was originally made by Hoang Nguyen. It allows maintaining authentication/authorization with Mozo Services, receiving Mozo lucky coins via beacons and buying/selling/transferring Mozo. It is also supporting UI components for authentication and buying/selling/transferring Mozo.
                        ```
                    DESC

    # This description is used to generate tags and improve search results.
    #   * Think: What does it do? Why did you write it? What is the focus?
    #   * Try to keep it short, snappy and to the point.
    #   * Write the description between the DESC delimiters below.
    #   * Finally, don't worry about the indent, CocoaPods strips it!

  s.homepage         = 'https://www.mozocoin.io/'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Mozo developers' => 'developer@mozocoin.io' }
  s.source           = { :git => 'https://github.com/Biglabs/Mozo-IW.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '10.0'


  # ――― Source Code ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  CocoaPods is smart about how it includes source code. For source files
  #  giving a folder will include any swift, h, m, mm, c & cpp files.
  #  For header files it will include any header in the folder.
  #  Not including the public_header_files will make all headers public.
  #

  s.source_files  = "MozoSDK/Classes/**/*.{swift}"
  s.resources = 'MozoSDK/Classes/**/*.xcdatamodeld'
  s.resource_bundles = {
      'MozoSDK' => ['MozoSDK/Classes/**/*.{storyboard,xib}']
  }
  # s.exclude_files = "Classes/Exclude"

  # s.public_header_files = "Classes/**/*.h"


  # ――― Resources ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  A list of resources included with the Pod. These are copied into the
  #  target bundle with a build phase script. Anything else will be cleaned.
  #  You can preserve files from being cleaned, please don't preserve
  #  non-essential files like tests, examples and documentation.
  #

  # s.resource  = "icon.png"
  # s.resources = "Resources/*.png"

  # s.preserve_paths = "FilesToSave", "MoreFilesToSave"


  # ――― Project Linking ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  Link your library with frameworks, or libraries. Libraries do not include
  #  the lib prefix of their name.
  #

  # s.framework  = "SomeFramework"
#  s.framework = 'MozoSDK/Classes/Framework/BitcoinKit.framework'
  # s.frameworks = "SomeFramework", "AnotherFramework"

#  s.vendored_frameworks = 'MozoSDK/Classes/Framework/BitcoinKit.framework'
  # s.library   = "iconv"
  # s.libraries = "iconv", "xml2"
#  s.vendored_libraries = 'Libraries/openssl/lib/libcrypto.a', 'Libraries/secp256k1/lib/libsecp256k1.a'

  # ――― Project Settings ――――――――――――――――――――――――――――――――――――――――――――――――――――――――― #
  #
  #  If your library depends on compiler flags you can set them in the xcconfig hash
  #  where they will only apply to your library. If you depend on other Podspecs
  #  you can include multiple dependencies to ensure it works.

  # s.requires_arc = true
#  s.pod_target_xcconfig = { 'SWIFT_WHOLE_MODULE_OPTIMIZATION' => 'YES',
#      'APPLICATION_EXTENSION_API_ONLY' => 'YES',
#      'SWIFT_INCLUDE_PATHS' => '${PODS_ROOT}/Libraries',
#      'HEADER_SEARCH_PATHS' => '"${PODS_ROOT}/Libraries/openssl/include" "${PODS_ROOT}/Libraries/secp256k1/include"',
#      'LIBRARY_SEARCH_PATHS' => '"${PODS_ROOT}/Libraries/openssl/lib" "${PODS_ROOT}/Libraries/secp256k1/lib"' }
#  s.preserve_paths = ['setup', 'Libraries']
#  s.prepare_command = 'sh setup/build_libraries.sh'
#  s.xcconfig = { 'SWIFT_OBJC_BRIDGING_HEADER' => 'MozoSDK/Classes/Bridging-Header.h' }
  # s.dependency 'Alamofire', '~> 4.5.1'
  # s.dependency 'Result', '~> 3.0.0'
   s.dependency 'SwiftyJSON', '~> 3.1.4'
  # s.dependency 'EstimoteSDK'
  # s.static_framework = true
  s.dependency 'SmileLock'
  s.dependency 'web3swift', '~> 0.8.1'
  s.dependency 'RNCryptor', '~> 5.0.3'
  s.dependency 'PromiseKit/Alamofire', '~> 6.0'
  s.dependency 'CoreStore', '~> 5.0'
end
