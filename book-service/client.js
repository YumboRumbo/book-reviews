const { Tracer } = require("zipkin");
const fetch = require("node-fetch");
const CLSContext = require("zipkin-context-cls");
const ctxImpl = new CLSContext("zipkin");
const wrapFetch = require("zipkin-instrumentation-fetch");
const { recorder } = require("../helpers/recorder");

const tracer = new Tracer({ ctxImpl, recorder }); // configure your tracer properly here

function getBookDetail(serviceName, remoteServiceName, url) {
  const zipkinFetch = wrapFetch(fetch, {
    tracer,
    serviceName,
    remoteServiceName
  });

  return new Promise((resolve, reject) => {
    // Your application code here
    zipkinFetch(url).then(res => {
      //console.log("res", res.json());
      resolve(res.json());
    });
  });
}

module.exports = {
  getBookDetail
};
