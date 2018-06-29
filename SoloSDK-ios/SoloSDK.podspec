Pod::Spec.new do |s|
  s.name         = 'SoloSDK'
  s.version      = '0.0.1'
  s.summary      = 'Solo SDK.'
  s.homepage     = 'https://github.com/Biglabs/Mozo-IW'
  s.authors      = { 'Tam Nguyen' => 'tam.nguyen@big-labs.com' }

  s.ios.deployment_target = '10.0'
  s.swift_version = '4.0'

  s.source       = { git: 'https://github.com/Biglabs/Mozo-IW.git', tag: s.version }
  s.source_files = 'SoloSDK/Sources/SoloSDK/**/*.{swift}', 'SoloSDK/Sources/Shared/*.{swift}'

  s.dependency 'Alamofire', '~> 4.5.1'
end
