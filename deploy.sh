git pull --rebase
docker stop lyssandeapi
docker rm lyssandeapi
docker build -t lyssandeapi .
docker run -dit --name lyssandeapi --ip 172.18.0.31 --network petit lyssandeapi
