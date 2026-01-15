const info = (message) => {
  console.log("INFO:", message);
};

const error = (message, error) => {
  console.log("ERROR:" + message);
  console.log(error);
};

const data = (message, data) => {
  console.log("DATA:" + message);
  console.log(data);
};

const success = (message, data) => {
  console.log("SUCCESS:" + message);
  console.log(data);
};

// Default export
export default { info, error, data, success };
