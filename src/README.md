docker run -d --name kafkaMQ --network kafka-network -p 9092:9092 -e KAFKA_ADVERTISED_LISTNERS=PLAINTEXT://localhost:9092 bitnami/kafka:latest

 docker run -d --name rabbitMQ -p 5672:5672 -p 15672:15672 rabbitmq:3-management