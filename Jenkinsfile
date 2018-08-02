pipeline {
  agent any
  stages {
    stage('Check-out') {
      steps {
        git(url: 'https://github.com/Biglabs/Mozo-IW', branch: 'master', changelog: true)
      }
    }
    stage('Change dir and build') {
      steps {
        dir(path: 'SOLOWallet-android') {
          sh 'pwd'
        }
      }
    }
  }
}
