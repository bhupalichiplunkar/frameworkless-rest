/* Create and export environment variables */

var environments = {};

// Staging (default) Environment

environments.staging = {
  httpPort: "4000",
  httpsPort: "4001",
  envName: "staging"
};

// Production Environment

environments.production = {
  httpPort: "8000",
  httpsPort: "8001",
  envName: "production"
};

// Determin which environments to export

var currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check for enivironment is present in defined environments and export else export satging environment

var environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
