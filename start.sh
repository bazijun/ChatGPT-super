
fuser -k -n tcp 3002
cd ./service
nohup pnpm build-start > service.log &
echo "Start GPT service complete!"
