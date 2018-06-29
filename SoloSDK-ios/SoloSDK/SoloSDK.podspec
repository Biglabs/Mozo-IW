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
  s.summary          = 'A short description of SoloSDK.'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/Biglabs/Mozo-IW'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'Tam Nguyen' => 'tam.nguyen@big-labs.com' }
  s.source           = { :git => 'https://github.com/Biglabs/Mozo-IW.git', :tag => s.version.to_s }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '10.0'

  s.source_files = 'SoloSDK/Classes/**/*'
  
  # s.resource_bundles = {
  #   'SoloSDK' => ['SoloSDK/Assets/*.png']
  # }

  # s.public_header_files = 'Pod/Classes/**/*.h'
  s.dependency 'Alamofire', '~> 4.5.1'
  s.dependency 'SwiftyJSON', '~> 3.1.4'
end
