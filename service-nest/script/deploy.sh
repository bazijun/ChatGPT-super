#/usr/bin
# 当前镜像版本号
version="1.0.0";
# 镜像名
imageName="chatgpt_nest_service";
# 容器名
containerName="chatgpt_nest_service";
# 主机端口
port="3004"
# 【readonly】容器端口
exposePort="9527"

cd ..

echo "--> docker build"
docker build -t "$imageName":"$version" .
if [ "$(docker ps -aq -f name=$container_name)" ]; then
    # Cleanup container
    docker rm -f "$containerName" || echo 'continue'
fi
docker run -d -p "$port":"$exposePort" --restart=always --name "$containerName" "$imageName":"$version"
docker rmi -f "$imageName":"$version"
