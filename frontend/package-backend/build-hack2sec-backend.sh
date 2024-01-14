#!/bin/sh

# Pull mongdb docker image
echo "[*] Pulling mongoDB docker image."
docker pull mongo

echo "[*] Pulling Minio docker image."
docker pull quay.io/minio/minio
# Create a network for different backend servers
echo "[*] Creating a local docker network 'hack2sec-backend-network'."
docker network create hack2sec-backend-network

# Create a persistent volume for mongo-db
echo "[*] Create a persistent volume for mongo-db."
docker volume create mongo-data

# Create a persistent volume for minio
echo "[*] Create a persistent volume for minio."
docker volume create minio-challenge-files

# Create hack2sec's backend application docker image
echo "[*] Building hack2sec backend application."
cd package-hack2sec
docker build -t hack2sec-backend-app .

# Run mongodb server
echo "[*] Starting mondoDB server."
docker run -d --network hack2sec-backend-network --name hack2sec-mongodb-server -v mongo-data:/data/db -p 27017:27017 mongo

# Run minio server
echo "[*] Starting Minio server."
docker run -d --network hack2sec-backend-network -p 9000:9000 -p 9090:9090 --name hack2sec-minio-server -v minio-challenge-files:/data -e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=hack2sec" quay.io/minio/minio server /data/ --console-address ":9090"

# Run hack2sec backend server
echo "[*] Starting backend application"
docker run -e MINIO_DEMO_USER_RW_ACCESS_KEY=OQBxdNtulpICt2G6whhO -e MINIO_DEMO_USER_RW_SECRET_KEY=ETND3HGHIbdRccKQgzf47eoopLbjxo5JXgOfIRjV -p 1337:1337 --network hack2sec-backend-network hack2sec-backend-app
