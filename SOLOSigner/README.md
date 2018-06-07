# SOLO Signer

## Table of Contents

* [Requirements](#requirements)
  * [Android devices](#android-devices)
  * [MacOS](#macos)
* [Getting Started](#getting-started)

## Requirements
  #### Android devices
   Android 4.4(API 19) or newer

  #### MacOS

   Xcode >= 9

## Getting Started
#### Install nodejs (v 8.11+) and npm (v 6.1+)

    https://nodejs.org/en/download/

#### Install yarn

    https://yarnpkg.com

#### Install React Native CLI

    npm install -g react-native-cli
    
#### Android SDK Setup

(MacOS) If the SDK is already installed from Android Studio, it should be in `/Users/[user]/Library/Android/sdk`.
If not, download and unzip the SDK from https://developer.android.com/studio/#command-tools

Set `ANDROID_HOME` and `ANDROID_SDK_HOME` environment variable to the path of the SDK. ie

    $ export ANDROID_HOME=/Users/[user]/Library/Android/sdk
    $ export ANDROID_SDK_HOME=/Users/[user]/Library/Android/sdk
    $ export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/tools/bin:$ANDROID_HOME/platform-tools:$PATH"
    
Download SDK packages

    $ yes | sdkmanager "platform-tools"
    $ yes | sdkmanager "platforms;android-23"
    $ yes | sdkmanager "platforms;android-27"
    $ yes | sdkmanager "build-tools;23.0.1"
    $ yes | sdkmanager "extras;android;m2repository"
    $ yes | sdkmanager "extras;google;m2repository"
    $ yes | sdkmanager "extras;google;instantapps"
    $ yes | sdkmanager --licenses

#### Checkout `master` branch & install node_modules

    $ cd Mozo-IW/SOLOSigner
    $ yarn

## Build and run debug

For Android: connect Android device via USB cable.

    $ yarn android

For iOS:

    $ yarn ios
