docker kill $(docker ps -q)
docker rm $(docker ps -aq)
docker rmi $(docker images dev-* -q)
rm -rf ~/.composer
mkdir -p ~/fabric-dev-servers/
cd ~/fabric-dev-servers/
export FABRIC_VERSION=hlfv12
./startFabric.sh
./createPeerAdminCard.sh
cd ~/scrap/blockchain-asset/contracts/
npm install
composer network install --card PeerAdmin@hlfv1 --archiveFile dms-network@0.1.1.bna
composer network start --networkName dms-network --networkVersion 0.1.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card
composer card import --file networkadmin.card
composer network ping --card admin@dms-network
cd ../web-app
npm install
