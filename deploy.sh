git pull --rebase
docker stop lysandeAPI
docker rm lysandeAPI
docker build -t lysandeAPI .
docker run -dit --name lysandeAPI --ip 172.18.0.31 --network petit lysande
