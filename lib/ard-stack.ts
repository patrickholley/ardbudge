import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class ArdStack extends cdk.Stack {
    public readonly bucketWebsiteURL: string;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create the S3 bucket
        const s3Bucket = new s3.Bucket(this, 'ArdBucket', {
            websiteIndexDocument: 'index.html',
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
            publicReadAccess: true,
        });

        // Provide the URL to the S3 bucket website
        this.bucketWebsiteURL = s3Bucket.bucketWebsiteUrl;

        // Example of deploying content to the S3 bucket
        new s3deploy.BucketDeployment(this, 'DeployWebsiteContent', {
            sources: [s3deploy.Source.asset('./dist')],
            destinationBucket: s3Bucket,
        });
    }
}

const app = new cdk.App();
new ArdStack(app, 'ArdStack');
app.synth();