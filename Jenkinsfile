pipeline {
    agent any

    environment {
        WEB_SERVER = '172.31.5.150'
        WEB_USER   = 'ubuntu'
        SSH_KEY    = '/var/lib/jenkins/.ssh/id_ed25519'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate') {
            steps {
                sh '''
                    test -f index.html
                    test -f style.css
                    echo "Website files are valid"
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    rsync -av --delete \
                      --exclude=".git" \
                      --exclude="Jenkinsfile" \
                      --exclude="README.md" \
                      -e "ssh -i ${SSH_KEY} -o IdentitiesOnly=yes" \
                      ./ \
                      ${WEB_USER}@${WEB_SERVER}:/var/www/html/
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 3
                    curl -fsS http://${WEB_SERVER}/ > /dev/null
                    echo "Website health check passed"
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the console output.'
        }
    }
}
