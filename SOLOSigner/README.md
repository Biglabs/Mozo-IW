# MOZO Wallet

This is the complete source code and the build instructions for the alpha version of the official desktop client for the Mozo Wallet application.

## Table of Contents

* [Supported systems](#supported-systems)
* [Build instruction](#build-instruction)
  * [Prerequisite](#prerequisite)
  * [Install dependencies and run](#install-dependencies-and-run)
  * [Package the application](#package-the-application)
* [Issue](#issue)


## Supported systems
* Mac OS X 10.8 - Mac OS X 10.12
* Ubuntu 16.04 - Ubuntu 18.04 on x86, and x86_64 architecture


## Build instruction
### Prerequisite
#### Ubuntu
1. Folow the [NodeJS instruction](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) to install **NodeJS v8**
2. Run following command to install neccessary packages:
```bash
sudo apt-get install -y build-essentials python git
```

#### Windows
1. Download and install **NodeJS v8** from [NodeJS website](https://nodejs.org/en/download/)
2. Install Visual C++ Build Environment: [Visual Studio Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools) (using "Visual C++ build tools" workload) or Visual Studio 2017 Community (using the "Desktop development with C++" workload)
3. Install [Python 2.7](https://www.python.org/downloads/windows/) (`v3.x.x` is not supported), and run `npm config set python python2.7`
4. Download and install [git](https://git-scm.com/downloads) client
4. Launch cmd, `npm config set msvs_version 2017`


#### MacOS
1. python (v2.7 recommended, v3.x.x is not supported) (already installed on macOS)
2. Xcode
  - You also need to install the `Command Line Tools` via Xcode. You can find this under the menu `Xcode -> Preferences -> Locations` (or by running `xcode-select --install` in your Terminal).
    + This step will install `gcc` and the related toolchain containing `make`
3. Download and install [git](https://git-scm.com/downloads) client


### Install dependencies and run
Apply for MacOS, Windows, and Linux
1. Clone or download the zip archive of the source code from the official client [repository](https://github.com/Biglabs/Mozo-IW)
2. From terminal console, change working directory to `source code\SOLOSigner` directory
3. Run `yarn` to install necessary dependencies package
4. Run `yarn desktop` to run the desktop application

### Package the application
#### Ubuntu
Run the following commands to create the `deb` package to distribute and install
```bash
yarn && yarn webpack && yarn buid:linux && yarn dist:linux
```
The `deb` file will be output in the `project directory\dist` directory

#### Windows
Run the following commands to create the `exe` package to distribute and install
```batch
yarn && yarn webpack && yarn build:win && yarn dist:win
```
The `exe` file will be output in the `project directory\dist` directory

#### MacOS
From the shell, type `bash` to use BASH, then run the following commands to create the `dmg` package to distribute and install
```batch
yarn && yarn webpack && yarn build:mac && yarn dist:mac && yarn zip
```
The `dmg` file will be output in the `project directory\dist` directory

# Issue
Currently the Windows releases having UI problems, so they are not stable to use.
