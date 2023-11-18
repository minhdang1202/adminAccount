#!/bin/sh
# Author: Greenify VietNam (greenifyvn@gmail.com)

set +x
SHA=$(git rev-parse HEAD)
PROJECT_IP=44.201.163.125

echo "*** MANUALLY DEPLOY TO DIGITAL OCEAN ***"

rm -rf build
yarn
yarn build:dev
scp -i .ssh/snaps-stag.pem -r build/* ubuntu@$PROJECT_IP:/var/www/

echo "*** End ***"
