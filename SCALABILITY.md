# Scalability Note

This document outlines the high-level strategies detailing how the **TaskFlow** backend architecture is prepared for scale, meeting the project's scalability and deployment readiness criteria.

## Current Scalability Advantages

1. **Stateless API Architecture (JWT):**
   Because authentication relies on stateless JSON Web Tokens (JWT) stored securely in HTTP-only cookies, the server does not need to maintain session state in memory. This allows the backend to be horizontally scaled smoothly behind a load balancer without sticky sessions.
2. **MVC Modularity:**
   The application logic is decoupled into distinct `routes/`, `controllers/`, `models/`, and `middlewares/`. If the feature set expands (e.g., adding user notifications or sub-tasks), new modules can be added cleanly without entangling the codebase.
3. **Mongoose Abstractions:**
   Database queries run asynchronously with Node.js’s event loop logic. The separation of Mongoose schemas ensures easy addition of new document aggregations in the future.

## Future Scaling Strategies

To support millions of users, the following architectural evolutions are recommended:

### 1. Database Indexing & Read Replicas (MongoDB)

As the `tasks` collection grows, queries targeting `owner` IDs would slow down.

- **Indexing:** Implement compound indexes on `owner` and `status` to make read-filtering near instantaneous.
- **Replica Sets:** Setup a MongoDB replica set where all read operations (Dashboard requests) target read-replicas, while write operations (Creating/Updating Tasks) target the primary node.

### 2. Implementation of Caching Layer (Redis)

- **Problem:** Users repeatedly request their same dashboard data on every load, causing unnecessary database hits.
- **Solution:** Introduce a Redis caching layer. When a user requests their dashboard tasks, the backend checks Redis first. If empty, it queries MongoDB, caches the result in Redis (e.g., with a 5-minute TTL), and returns the payload. The cache is automatically invalidated when the user creates/updates a task.

### 3. Load Balancing & Horizontal Scaling

- The single Node.js process should be deployed within **Docker Containers** orchestrated by Kubernetes or AWS ECS.
- An API Gateway (e.g., Nginx, AWS API Gateway) or Load Balancer will sit in front of the instances to distribute traffic via Round-Robin algorithms.

### 4. Eventual Shift to Microservices (Event-Driven)

If the project pivots into an enterprise tool with email notifications, billing, and heavy analytics, the monolithic Express app can be split into microservices:

- **Auth Service:** Dedicated completely to user management and JWT issuing.
- **Task Service:** Dedicated to core CRUD operations.
- **Notification Service:** Listens to a Message Queue (like RabbitMQ or AWS SQS) for e.g. "Task Created" events, firing off emails asynchronously so the primary API responds faster.
