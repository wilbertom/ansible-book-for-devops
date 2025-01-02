import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AnsibleBookStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "vpc", {
      isDefault: true,
    });

    const ansibleBookGroup = new ec2.SecurityGroup(this, "ansibleBookGroup", {
      vpc,
      securityGroupName: "ansibleBookGroup",
      description: "ansibleBookGroup CDK group",
    });

    ansibleBookGroup.addIngressRule(
      ec2.Peer.ipv4("162.211.34.240/32"),
      ec2.Port.SSH,
      "Allow SSH from Wils house",
    );

    const keyPair = new ec2.KeyPair(this, "ansibleBookKey", {
      keyPairName: "ansibleBookKey",
      type: ec2.KeyPairType.ED25519,
      format: ec2.KeyPairFormat.PEM,
    });

    const machineImage = ec2.MachineImage.lookup({
      name: "Rocky-8-EC2-Base-8.9-20231119.0.x86_64-d6577ceb-8ea8-4e0e-84c6-f098fc302e82",
    });

    const app01 = new ec2.Instance(this, "app01", {
      instanceName: "app01",
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MEDIUM,
      ),
      keyPair,
      machineImage,
      vpc: vpc,
      securityGroup: ansibleBookGroup,
    });

    new cdk.CfnOutput(this, "app01DNSName", {
      value: app01.instancePublicDnsName,
    });
  }
}
