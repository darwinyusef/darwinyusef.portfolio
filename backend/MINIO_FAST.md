docker run -d \
  --name portfolio-minio \
  --network portfolio-network \
  -p 9000:9000 \
  -p 9090:9090 \
  -e "MINIO_ROOT_USER=adminminio" \
  -e "MINIO_ROOT_PASSWORD=tremendas25" \
  -v portfolio-minio-data:/data \
  minio/minio server /data --console-address ":9090"