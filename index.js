/*
  Primary file
*/

// dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
var fs = require("fs");
var dataSaver = require("./lib");
// the server should respond to all requests with a string

// Test
// @TODO : delete this
// dataSaver.create("test", "test", { hello: true }, response => {
//   console.log(response.message);
// });

// Test
// @TODO : delete this
dataSaver.read("test", "test", response => {
  console.log(
    "\ndata: ",
    response.data,
    "\nerror: ",
    response.error,
    "\nsuccess: ",
    response.success,
    "\nmessage: ",
    response.message
  );
});

// instantiate HTTP server
const httpServer = http.createServer((request, response) => {
  unifiedServer(request, response);
});

// start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(
    `Server is listening on port ${config.httpPort} in ${config.envName} mode`
  );
});

// instantiate HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem")
};
const httpsServer = https.createServer(
  httpsServerOptions,
  (request, response) => {
    unifiedServer(request, response);
  }
);

// start the HTTP server
httpsServer.listen(config.httpsPort, () => {
  console.log(
    `Server is listening on port ${config.httpsPort} in ${config.envName} mode`
  );
});

// server logic for http and https
var unifiedServer = (request, response) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(request.url, true);
  // Get path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, "");

  //Get query string an object
  const queryObject = parsedUrl.query;
  queryObject.toString = function() {
    return JSON.stringify(this);
  };
  // get HTTP method
  var method = request.method.toLowerCase();

  //get headers
  var headers = request.headers;
  headers.toString = function() {
    return JSON.stringify(this);
  };

  // get payload
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  request.on("data", data => {
    buffer += decoder.write(data);
  });

  request.on("end", () => {
    buffer += decoder.end();

    //choose handler which should process the request. if non are found send to not found handler

    var chosenHandler = router[trimmedPath]
      ? router[trimmedPath]
      : handlers.notFound;

    var data = {
      trimmedPath,
      queryObject,
      method,
      headers,
      payload: buffer
    };

    chosenHandler(data, (statusCode, payload) => {
      //default statusCode and payload to 200 and {} respectively
      statusCode = typeof statusCode === "number" ? statusCode : 200;
      payload = typeof payload === "object" ? payload : {};

      var payloadString = JSON.stringify(payload);

      // Send the response
      response.setHeader("Content-Type", "application/json");
      response.writeHead(statusCode);
      response.end(payloadString);
      //Log request path
      console.log(
        `Request recieved at path : ${trimmedPath} 
       method: ${method} 
       query : ${queryObject} 
       headers : ${headers}
       payload: ${buffer}
       payloadString: ${payloadString}`
      );
    });
  });
};

//routing handlers
var handlers = {};

handlers.sample = (data, callback) => {
  //perform business logic and return http status code and response data / payoad object
  callback(406, { name: "Bhupali" });
};

//for ping handler
handlers.ping = (data, callback) => {
  //perform business logic and return status code and response data
  callback(200);
};

//for 404
handlers.notFound = (data, callback) => {
  //perform business logic and return status code and response data
  callback(404);
};

var router = {
  sample: handlers.sample,
  ping: handlers.ping
};
