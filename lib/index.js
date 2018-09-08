/*
  Library for storing and editing data
*/

// dependencies

const fs = require("fs");
const path = require("path");

// container for module ( to be exported )

const lib = {};

const baseDirectory = path.join(__dirname, "/../.data/");

// write data to file

lib.create = (dir, file, data, callback) => {
  fs.open(
    `${baseDirectory}${dir}/${file}.json`,
    "wx",
    (error, fileDescriptor) => {
      // response to send
      let response = {
        message: "",
        success: true
      };
      if (!error && fileDescriptor) {
        const stringData = JSON.stringify(data);
        //write data
        fs.write(fileDescriptor, stringData, err => {
          if (!err) {
            fs.close(fileDescriptor, e => {
              if (!e) {
                response.message = "Data saved successfully";
                response.success = true;
                callback(response);
              } else {
                response.message = "Couldn't close file";
                response.success = false;
                callback(response);
              }
            });
          } else {
            response.message = "Couldn't write to file";
            response.success = false;
            callback(response);
          }
        });
      } else {
        response.message = "Couldn't create file. It may already exist";
        response.success = false;
        callback(response);
      }
    }
  );
};

// read data from file
lib.read = (dir, file, callback) => {
  fs.readFile(`${baseDirectory}${dir}/${file}.json`, "utf-8", (error, data) => {
    // response to send
    let response = {
      data: null,
      message: "",
      success: true,
      error: null
    };
    if (!error && data) {
      response.data = data;
      response.message = "Data retrived successfully";
      callback(response);
    } else {
      response.message = "Couldn't read from file. It may not exist";
      response.error = error;
      response.success = false;
      callback(response);
    }
  });
};

// export module

module.exports = lib;
