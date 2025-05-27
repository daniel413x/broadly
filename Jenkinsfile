pipeline {
    agent any

    tools {
        // your Jenkins nodejs installation must be named '18.0.0' for this to match
        nodejs '18.0.0'
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

        stage('Build Frontend') {
            steps {
                dir('client') {
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
                            -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
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

// Function to handle success case
def handleSuccess() {
    if (env.BRANCH_NAME == "${STAGING_BRANCH}") {
        def JWT = generateJWT()
        def GITHUB_TOKEN = retrieveAccessToken(JWT)
        createPullRequest(GITHUB_TOKEN)
    }
}

// Function to handle failure case
def handleFailure() {
    echo 'The pipeline failed. Reverting last PR.'
    def JWT = generateJWT()
    def GITHUB_TOKEN = retrieveAccessToken(JWT)
    revertLastPullRequest(GITHUB_TOKEN)
}

// Function to generate JWT
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

// Function to retrieve access token
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

// Function to create pull request
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

// Function to request reviewers for the pull request
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

// Function to revert last pull request
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

// Function to revert the pull request via GraphQL
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

// Function to handle the revert response
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

// Function to request reviewers for the reverted pull request
def requestReviewersForRevert(prAuthor, GITHUB_TOKEN, jsonResponse) {
    def revertPrNumber = jsonResponse.data.revertPullRequest.revertPullRequest.number
    def revertReviewers = "${GITHUB_REVIEWER_USERNAMES}"

    // Convert the comma-separated string into a list of trimmed usernames (removing quotes and extra spaces)
    def reviewerList = revertReviewers.split(',').collect { it.trim().replaceAll('"', '') }

    // Check if prAuthor is not already in the list
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
