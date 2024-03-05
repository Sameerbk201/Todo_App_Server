pipeline {
    agent any
    stages {
        stage('Fetch Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Sameerbk201/Todo_App_Server.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    try {
                        sh 'npm i'
                    } catch (err) {
                        echo 'npm --version error'
                        currentBuild.result = 'FAILURE'
                        error(err)
                    }
                }
            }

            post {
                success {
                    echo 'Success'
                }
                failure {
                    echo 'Build failed'
                }
            }
        }

        stage('analise') {
            steps {
                script {
                    try {
                        echo 'analysis began'
                        sh 'npm --version' 
                    } catch (err) {
                        echo 'npm --version error'
                        currentBuild.result = 'FAILURE'
                        error(err)
                    }
                }
            }

            post {
                success {
                    echo 'Success analysis'
                }
                failure {
                    echo 'analise failed'
                }
            }
        }
       
    }
}
