pipeline {
  agent any
  stages {
    stage('Check-out') {
      parallel {
        stage('Check-out') {
          steps {
            git(url: 'https://github.com/Biglabs/Mozo-IW', branch: 'master', changelog: true)
          }
        }
        stage('Where I\'m I') {
          steps {
            sh 'pwd'
          }
        }
        stage('Move to folder') {
          steps {
            sh 'cd SOLOWallet-android/'
          }
        }
      }
    }
 	stage('Check-again') {
	  steps {
	    dir ('SOLOWallet-android') {
	    sh 'pwd'
	}
      }
    }
  }
}
