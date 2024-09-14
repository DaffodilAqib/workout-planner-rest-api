const fs = require('fs');
const path = require('path');

const { authenticateUser } = require('../middleware/auth')

// Generic route loader
const loadRoutes = (app) => {
  const routesPath = path.join(__dirname, '../routes');
  console.log("routerPath", routesPath);
  // Read all files in the routes folder
  fs.readdirSync(routesPath).forEach((file) => {
    const route = require(path.join(routesPath, file));
    console.log("router", route);

    // Apply the route to the app
    if (route.requiresAuth) {
      app.use(route.path, authenticateUser, route.router);  // Apply auth middleware
    } else {
      app.use(route.path, route.router);  // No auth middleware for this route
    }
  });
};

module.exports = {
  loadRoutes
}