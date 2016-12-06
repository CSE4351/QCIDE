/* jshint node: true */

module.exports = function(deployTarget) {
    var ENV = {
        build: {
            environment: deployTarget
        },
        s3: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            bucket: process.env.AWS_DEPLOY_BUCKET,
            region: 'us-east-1'
        },
        's3-index': {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            bucket: process.env.AWS_DEPLOY_BUCKET,
            region: 'us-east-1',
            allowOverwrite: true,
            revisionKey: 'v1'
        },
        'revision-data': {
            type: 'file-hash',
        }
    };

    return ENV;
};