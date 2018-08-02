pipeline {
  agent any
  stages {
    stage('Check-out') {
      steps {
        git(url: 'https://github.com/Biglabs/Mozo-IW', branch: 'master', changelog: true)
      }
    }
    stage('Change dir and build') {
      if (env.ANDROID_HOME == null || env.ANDROID_HOME == "") error "ANDROID_HOME not defined"
      if (env.JAVA_HOME == null || env.JAVA_HOME == "") error "JAVA_HOME not defined"
      steps {
        dir(path: 'SOLOWallet-android') {
          sh 'pwd'

        }

      }
    }
  }
}
