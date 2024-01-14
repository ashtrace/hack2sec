# hack2sec
A Capture-The-Flag platform created to seamlessly integrate practical cybersecurity exercises into university curricula, thereby reducing the learning curve associated with these activities.

Developed by Aishwarya Raj (backend) and Siddhant Saxena (frontend), for submission as final project of their Bachelors of Technology.

## Deployment Procedures

## Build & Installation

### Environment
- Install Docker
- Create docker network
    ```
    shell~# docker network create hack2sec-backend-network
    ```
- Create docker volume for database and file server
    ```
    shell~# docker volume create mongo-data
    shell~# docker volume create minio-challenge-files
    ```

### Database Server
- Pull Mongo-DB docker image
    ```
    shell~# docker pull mongo
    ```

### File Server
- Pull MinIO docker image
    ```
    shell~# docker pull quay.io/minio/minio
    ```

### Backend-Server
- Navigate to backend/package-hack2sec
    ```
    shell~# cd backend/package-hack2sec
    ```
- Modify Dockerfile to include your secrets.
- Build docker image for backend server
    ```
    shell~# docker build -t hack2sec-backend-app .
    ```

### Frontend-Server
- Navigate to frontend/
    ```
    shell~# cd frontend/
    ```
- Install code dependencies
    ```
    shell~# npm install
    shell~# npm install chart.js jwt-decode axios serve
    ```

## Deployment
- Run database server
    ```
    shell~# docker run -d --network hack2sec-backend-network --name hack2sec-mongodb-server -v mongo-data:/data/db -p 27017:27017 mongo
    ```

- Run file server
    ```
    shell~# docker run -d --network hack2sec-backend-network -p 9000:9000 -p 9090:9090 --name hack2sec-minio-server -v minio-challenge-files:/data -e "MINIO_ROOT_USER=admin" -e "MINIO_ROOT_PASSWORD=hack2sec" quay.io/minio/minio server /data/ --console-address ":9090"
    ```

    - Open `http://localhost:9090/` in web-browser.
    - Login with username: admin, password: password.
    - Create a bucket named `hack2sec`
    - Create a new user with read/write privileges.
    - Generate their access key pair: access-token and secret-token.

- Run backend server
    ```
    shell~# docker run -e MINIO_DEMO_USER_RW_ACCESS_KEY=<minio user access token> -e MINIO_DEMO_USER_RW_SECRET_KEY=<minio secret token> -p 1337:1337 --network hack2sec-backend-network hack2sec-backend-app
    ```

- Run frontend server
    ```
    shell~# npx serve -s build
    ```