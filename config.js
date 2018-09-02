/* Create and export environment variables */

var environments = {};

// Staging (default) Environment

environments.staging = {
  port: "5001",
  envName: "staging"
};

// Production Environment

environments.production = {
  port: "5000",
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
