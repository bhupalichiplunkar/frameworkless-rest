/*
  Primary file
*/

// dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
// the server should respond to all requests with a string

const server = http.createServer((request, response) => {
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
});

// start the server
server.listen(config.port, () => {
  console.log(
    `Server is listening on port ${config.port} in ${config.envName} mode`
  );
});

//routing handlers

var handlers = {};

handlers.sample = (data, callback) => {
  //perform business logic and return http status code and response data / payoad object
  callback(406, { name: "Bhupali" });
};

//for 404
handlers.notFound = (data, callback) => {
  //perform business logic and return status code and response data
  callback(404);
};

var router = {
  sample: handlers.sample
};
