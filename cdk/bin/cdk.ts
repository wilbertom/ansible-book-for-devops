#!/opt/homebrew/opt/node/bin/node
import * as cdk from "aws-cdk-lib";
import { AnsibleBookStack } from "../lib/ansible-book-stack";

const app = new cdk.App();
new AnsibleBookStack(app, "AnsibleBookStack", {
  env: { account: "213774913154", region: "us-east-1" },
});
