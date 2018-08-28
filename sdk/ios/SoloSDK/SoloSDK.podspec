#
# Be sure to run `pod lib lint SoloSDK.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'SoloSDK'
  s.version          = '0.1.0'
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

  s.source_files = 'SoloSDK/Classes/**/*'
  
  # s.resource_bundles = {
  #   'SoloSDK' => ['SoloSDK/Assets/*.png']
  # }

  # s.public_header_files = 'Pod/Classes/**/*.h'
    s.dependency 'Alamofire', '~> 4.5.1'
    s.dependency 'Result', '~> 3.0.0'
    s.dependency 'SwiftyJSON', '~> 3.1.4'
    s.dependency 'PromiseKit/Alamofire', '~> 6.0'
    s.dependency 'EstimoteSDK'
    s.static_framework = true
end
