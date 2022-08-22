git pull --rebase
docker stop lysandeapi
docker rm lysandeapi
docker build -t lysandeapi .
docker run -it --name lysandeapi --ip 172.18.0.31 --network petit lysandeapi
