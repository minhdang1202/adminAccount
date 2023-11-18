#!/bin/sh
# Author: Greenify VietNam (greenifyvn@gmail.com)

set +x
SHA=$(git rev-parse HEAD)
PROJECT_IP=52.90.13.76

echo "*** MANUALLY DEPLOY TO DIGITAL OCEAN ***"

rm -rf build
yarn
echo "Do you want update version? (y/n)"
read response
if [ "$response" == "y" ]; then
  echo "Please input new version"
  read new_version
  package_json="package.json"
  sed -i "s/\"version\": \".*\"/\"version\": \"$new_version\"/" "$package_json"
fi
yarn build:dev
scp -i .ssh/id_rsa_ec2.pem -r build/* ubuntu@$PROJECT_IP:/var/www/

echo "*** End ***"
