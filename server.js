// Import necessary modules
const cluster = require('cluster');
const os = require('os');
const fs = require('fs');
const path = require('path');
const express = require('express');
require('dotenv').config();
const { connect } = require('./utils/dbConnection');
const cookieParser = require('cookie-parser');
const { loadRoutes } = require('./utils/syncRoutes');

// Check if the current process is the master process
connect().then((dbObj) => {
  console.log("DB connected successfully");

}).catch((err) => {
        console.log("unable to connect with DB", err);
})

app.use(cookieParser());
if (cluster.isMaster) {
  // Get the number of CPU cores
  const numCPUs = os.cpus().length;

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Event listener for worker exits
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Forking a new worker...\n');
    cluster.fork();
  });

} else {
  // Worker processes create the Express server
  const app = express();

  // Middleware for parsing JSON
app.use(express.json());

loadRoutes(app);

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT} by worker ${process.pid}`);
  });
}
