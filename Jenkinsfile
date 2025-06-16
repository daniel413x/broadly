pipeline {
    agent any

    tools {
        // your Jenkins nodejs installation must be named '18.x.x' for this to match
        nodejs '18.20.2'
    }

    environment {
        MAJOR_VERSION = '0'
        MINOR_VERSION = '2'
        PATCH_VERSION = "${env.BUILD_NUMBER}"
        STAGING_BRANCH = 'staging'
        MAIN_BRANCH = 'main'
        GITHUB_REVIEWER_USERNAMES = '"daniel413x"'
        // obtained via curl to https://api.github.com/app/installations w/ access token
        GITHUB_APP_INSTALLATION = credentials('GITHUB_APP_INSTALLATION')
        // obtained via GH App settings page 
        GITHUB_APP_CLIENT_ID = credentials('GITHUB_APP_CLIENT_ID')
        // could be single repo, e.g. daniel413x/broadly, or organization, e.g. repos/My-Budget-Buddy/Budget-Buddy-UserService
        GITHUB_REPO = 'daniel413x/broadly'
        // just a mongodb connection string
        // this could end up being the primary database for the project
        PAYLOAD_DATABASE_URI = credentials('PAYLOAD_DATABASE_URI')
        PAYLOAD_SECRET = credentials('PAYLOAD_SECRET')
        // generated/obtained via GH App settings page
        PEM = credentials('GITHUB_APP_PEM')
    }

    stages {
        stage('Prepare Version') {
            steps {
                script {
                    def newPatchVersion = PATCH_VERSION.toInteger() + 1
                    env.VERSION = "${MAJOR_VERSION}.${MINOR_VERSION}.${newPatchVersion}"
                    echo "Updated version to: ${env.VERSION}"
                }
            }
        }

      stage('Pull Dependencies'){
          steps{
            sh '''
            git clone https://github.com/daniel413x/broadly-functional-tests.git functional-tests
            '''
          }
      }

        stage('Build Frontend') {
            steps {
                withCredentials([string(credentialsId: 'PAYLOAD_DATABASE_URI', variable: 'DATABASE_URI'), string(credentialsId: 'PAYLOAD_SECRET', variable: 'PAYLOAD_SECRET')]) {
                    sh '''
                    node -v
                    npm install && npm run build
                    '''
                }
            }
        }

        stage('Test Frontend') {
            steps {
                script {
                    withSonarQubeEnv('SonarCloud') {
                        sh '''
                        npm run test -- --coverage
                        npx sonar-scanner \
                            -Dsonar.projectKey=daniel413x_broadly-client \
                            -Dsonar.projectName=broadly-client-unit-tests \
                            -Dsonar.organization=daniel413x \
                            -Dsonar.sources=src \
                            -Dsonar.exclusions=**/__tests__/**,src/test/** \
                            -Dsonar.javascript.lcov.reportPaths=./coverage/lcov.info
                        '''
                    }
                }
            }
            
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/lcov-report/**/*', fingerprint: true
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Test Report: Frontend Unit Testing'
                    ])
                }
            }
        }

        stage('Perform Functional Tests') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'PAYLOAD_DATABASE_URI', variable: 'DATABASE_URI'), string(credentialsId: 'PAYLOAD_SECRET', variable: 'PAYLOAD_SECRET')]) {
                        script {
                            def pids = startServers()

                            waitForService('http://localhost:3000', 'frontend')
                                dir('functional-tests') {
                                    sh '''
                                        mvn test -Dheadless=true
                                    '''
                                }
                            stopServers(pids)
                        }
                    }
                }
            }

            post {
                always {
                    archiveArtifacts artifacts: 'functional-tests/target/extent-report/**/*', fingerprint: true
                    publishHTML(target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'functional-tests/target/extent-report',
                        reportFiles: 'all-pages-report.html',
                        reportName: 'Test Report: Functional Testing'
                    ])
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }

        success {
            script {
                handleSuccess()
            }
        }

        failure {
            script {
                handleFailure()
            }
        }
    }
}

// utility function to start servers
def startServers() {
    def pids = [:]

    pids.frontend = sh(script: 'npm run dev & echo $! > dev.pid', returnStdout: true).trim()

    return pids
}

// utility function to wait for a service to be ready
def waitForService(url, serviceName) {
    sh """#!/bin/bash
        TRIES_REMAINING=30
        echo "Waiting for ${serviceName} to be ready at ${url}..."
        while ! curl --output /dev/null --silent "${url}"; do
            TRIES_REMAINING=\$((TRIES_REMAINING - 1))
            if [ \$TRIES_REMAINING -le 0 ]; then
                echo "ERROR: ${serviceName} did not start within expected time."
                exit 1
            fi
            echo "waiting for ${serviceName}..."
            sleep 5
        done
        echo "***${serviceName} is ready***"
    """
}

// utility function to stop servers
def stopServers(pids) {
    pids.each { key, pid ->
        sh 'kill $(cat dev.pid) || true'
    }
}

// function to handle success case
def handleSuccess() {
    if (env.BRANCH_NAME == "${STAGING_BRANCH}") {
        def JWT = generateJWT()
        def GITHUB_TOKEN = retrieveAccessToken(JWT)
        createPullRequest(GITHUB_TOKEN)
    }
}

// function to handle failure case
def handleFailure() {
    echo 'The pipeline failed. Reverting last PR.'
    def JWT = generateJWT()
    def GITHUB_TOKEN = retrieveAccessToken(JWT)
    revertLastPullRequest(GITHUB_TOKEN)
}

// function to generate jwt
def generateJWT() {
    def now = sh(script: 'date +%s', returnStdout: true).trim()
    def iat = (now.toInteger() - 60).toString()
    def exp = (now.toInteger() + 600).toString()

    echo "Current time: ${now}"
    echo "Issued at: ${iat}"
    echo "Expires at: ${exp}"

    return sh(script: """
        #!/bin/bash
        client_id="${GITHUB_APP_CLIENT_ID}"
        pem="${PEM}"
        iat="${iat}"
        exp="${exp}"
        b64enc() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
        header=\$(echo -n '{"typ":"JWT","alg":"RS256"}' | b64enc)
        payload=\$(echo -n "{\\"iat\\":\${iat},\\"exp\\":\${exp},\\"iss\\":\\"\${client_id}\\"}" | b64enc)
        header_payload="\${header}.\${payload}"

        signature=\$(echo -n "\${header_payload}" | openssl dgst -sha256 -sign \${PEM} | b64enc)
        JWT="\${header_payload}.\${signature}"
        echo "\${JWT}"
    """, returnStdout: true).trim()
}

// function to retrieve access token
def retrieveAccessToken(JWT) {
    def tokenResponse = httpRequest(
        url: "https://api.github.com/app/installations/${GITHUB_APP_INSTALLATION}/access_tokens",
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: '*/*'],
            [name: 'Authorization', value: "Bearer ${JWT}"],
        ],
        contentType: 'APPLICATION_JSON'
    )

    if (tokenResponse.status == 201) {
        def jsonResponse = readJSON text: tokenResponse.content
        echo "Access token ${jsonResponse.token} created."
        return jsonResponse.token
    } else {
        error 'Access token retrieval failed, aborting pipeline'
    }
}

// function to create pull request
def createPullRequest(GITHUB_TOKEN) {
    def pullResponse = httpRequest(
        url: "https://api.github.com/repos/${GITHUB_REPO}/pulls",
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: '*/*'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
        ],
        contentType: 'APPLICATION_JSON',
        requestBody: """
            {
                "title": "Automated PR: Pipeline successful",
                "head": "${STAGING_BRANCH}",
                "base": "${MAIN_BRANCH}",
                "body": "This pull request was created automatically after a successful pipeline run."
            }
        """
    )
    echo "Response status: ${pullResponse.status}"
    echo "Response body: ${pullResponse.content}"


    if (pullResponse.status == 201) {
        def jsonResponse = readJSON text: pullResponse.content
        int prNumber = jsonResponse.number
        echo "PR #${prNumber} created."
        requestReviewers(GITHUB_TOKEN, prNumber)
    } else {
        echo "Failed to create PR. Status: ${pullResponse.status}"
    }
}

// function to request reviewers for the pull request
def requestReviewers(GITHUB_TOKEN, prNumber) {
    def reviewerResponse = httpRequest(
        url: "https://api.github.com/repos/${GITHUB_REPO}/pulls/${prNumber}/requested_reviewers",
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: 'application/vnd.github+json'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
            [name: 'X-GitHub-Api-Version', value: '2022-11-28']
        ],
        contentType: 'APPLICATION_JSON',
        requestBody: """
            {
                "reviewers": [${GITHUB_REVIEWER_USERNAMES}]
            }
        """
    )

    if (reviewerResponse.status == 201) {
        echo "Reviewers requested for PR #${prNumber}."
    } else {
        echo "Failed to request reviewers for PR #${prNumber}. Status: ${reviewerResponse.status}"
    }
}

// function to revert last pull request
def revertLastPullRequest(GITHUB_TOKEN) {
    def getPullResponse = httpRequest(
        url: "https://api.github.com/repos/${GITHUB_REPO}/commits/${env.GIT_COMMIT}/pulls",
        httpMode: 'GET',
        customHeaders: [
            [name: 'Accept', value: '*/*'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
        ],
        contentType: 'APPLICATION_JSON'
    )

    if (getPullResponse.status == 200) {
        def jsonResponse = readJSON text: getPullResponse.content
        def pullRequest = jsonResponse[0]
        def prNumber = pullRequest.number
        def prNodeId = pullRequest.node_id
        def prTitle = pullRequest.title
        def prAuthor = pullRequest.user.login

        echo "Retrieved last PR #${prNumber}."

        def revertResponse = revertPullRequest(prNumber, prNodeId, prTitle, GITHUB_TOKEN)
        handleRevertResponse(revertResponse, prNumber, prAuthor, GITHUB_TOKEN)
    } else {
        error "Failed to retrieve last PR. Status: ${getPullResponse.status}"
    }
}

// function to revert the pull request via graphql
def revertPullRequest(prNumber, prNodeId, prTitle, GITHUB_TOKEN) {
    return httpRequest(
        url: 'https://api.github.com/graphql',
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: '*/*'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
        ],
        contentType: 'APPLICATION_JSON',
        requestBody: """
            {
                "query": "mutation RevertPullRequest { \
                    revertPullRequest( \
                        input: { \
                            pullRequestId: \\"${prNodeId}\\", \
                            title: \\"Automated PR: Revert '${prTitle}' on failed pipeline run\\", \
                            draft: false, \
                            body: \\"This pull request was created automatically after a failed pipeline run. This pull request reverts PR #${prNumber}.\\" \
                        } \
                    ) { \
                        revertPullRequest { \
                            createdAt \
                            id \
                            number \
                            state \
                            title \
                            url \
                        } \
                        pullRequest { \
                            baseRefOid \
                            createdAt \
                            headRefOid \
                            id \
                            number \
                            state \
                            title \
                            url \
                        } \
                    } \
                }"
            }
        """
    )
}

// function to handle the revert response
def handleRevertResponse(revertResponse, prNumber, prAuthor, GITHUB_TOKEN) {
    if (revertResponse.status == 400) {
        def jsonResponse = readJSON text: revertResponse.content
        echo "Failed to revert PR #${prNumber}. ${jsonResponse.errors[0].message}"
    } else if (revertResponse.status == 200) {
        def jsonResponse = readJSON text: revertResponse.content
        if (jsonResponse.errors != null) {
            error "Failed to revert PR #${prNumber}. ${jsonResponse.errors[0].message}"
        } else {
            echo "PR #${prNumber} reverted."
            requestReviewersForRevert(prAuthor, GITHUB_TOKEN, jsonResponse)
        }
    } else {
        error 'GraphQL request failed, aborting pipeline'
    }
}

// function to request reviewers for the reverted pull request
def requestReviewersForRevert(prAuthor, GITHUB_TOKEN, jsonResponse) {
    def revertPrNumber = jsonResponse.data.revertPullRequest.revertPullRequest.number
    def revertReviewers = "${GITHUB_REVIEWER_USERNAMES}"

    // convert the comma-separated string into a list of trimmed usernames (removing quotes and extra spaces)
    def reviewerList = revertReviewers.split(',').collect { it.trim().replaceAll('"', '') }

    // check if prauthor is not already in the list
    if (!reviewerList.contains(prAuthor) && prAuthor != null && prAuthor != 'jenkins_broadly') {
        revertReviewers += ", \"${prAuthor}\""
    }

    def revertRequestResponse = httpRequest(
        url: "https://api.github.com/repos/${GITHUB_REPO}/pulls/${revertPrNumber}/requested_reviewers",
        httpMode: 'POST',
        customHeaders: [
            [name: 'Accept', value: 'application/vnd.github+json'],
            [name: 'Authorization', value: "Bearer ${GITHUB_TOKEN}"],
            [name: 'X-GitHub-Api-Version', value: '2022-11-28']
        ],
        contentType: 'APPLICATION_JSON',
        requestBody: """
            {
                "reviewers": [${revertReviewers}]
            }
        """
    )

    if (revertRequestResponse.status == 201) {
        echo "Reviewers requested for revert PR #${revertPrNumber}."
    } else {
        echo "Failed to request reviewers for revert PR #${revertPrNumber}. Status: ${revertRequestResponse.status}"
    }
}
