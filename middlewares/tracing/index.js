const {
  Annotation,
  HttpHeaders: Header,
  option: { Some, None },
  TraceId,
  Tracer
} = require("zipkin");
const { recorder } = require("../../helpers/recorder");
const CLSContext = require("zipkin-context-cls");
const ctxImpl = new CLSContext("zipkin");
const tracer = new Tracer({ ctxImpl, recorder });
const url = require("url");

function containsRequiredHeaders(req) {
  return (
    req.headers[Header.TraceId.toLowerCase()] !== undefined &&
    req.headers[Header.SpanId.toLowerCase()] !== undefined
  );
}

function stringToIntOption(str) {
  try {
    return new Some(parseInt(str));
  } catch (err) {
    return None;
  }
}

function formatRequestUrl(req) {
  const parsed = url.parse(req.originalUrl);
  return url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: parsed.pathname,
    search: parsed.search
  });
}

function beginTrace(request, config) {
  function readHeader(header) {
    const val = request.headers[header];
    if (val != null) {
      return new Some(val);
    } else {
      return None;
    }
  }

  return new Promise((resolve, reject) => {
    try {
      if (containsRequiredHeaders(request)) {
        const spanId = readHeader(Header.SpanId);
        spanId.ifPresent(sid => {
          const traceId = readHeader(Header.TraceId);
          const parentSpanId = readHeader(Header.ParentSpanId);
          const sampled = readHeader(Header.Sampled);
          const flags = readHeader(Header.Flags)
            .flatMap(stringToIntOption)
            .getOrElse(0);
          const id = new TraceId({
            traceId,
            parentId: parentSpanId,
            spanId: sid,
            sampled: sampled.map(stringToBoolean),
            flags
          });
          tracer.setId(id);
        });
      } else {
        tracer.setId(tracer.createRootId());
        if (request.headers[Header.Flags]) {
          const currentId = tracer.id;
          const idWithFlags = new TraceId({
            traceId: currentId.traceId,
            parentId: currentId.parentId,
            spanId: currentId.spanId,
            sampled: currentId.sampled,
            flags: readHeader(Header.Flags)
          });
          tracer.setId(idWithFlags);
        }
      }

      tracer.recordServiceName(config.serviceName);
      tracer.recordRpc(request.method.toUpperCase());
      tracer.recordBinary("http.url", formatRequestUrl(request));
      // tracer.recordBinary("rpc.fn", request.body.fn);
      tracer.recordAnnotation(new Annotation.ServerRecv());
      tracer.recordAnnotation(new Annotation.LocalAddr({ port: config.port }));

      resolve(tracer.id);
    } catch (e) {
      reject(e);
    }
  });
}

function endTrace(response, traceId) {
  return new Promise((resolve, reject) => {
    try {
      tracer.setId(traceId);
      tracer.recordBinary("http.status_code", response.status.toString());
      tracer.recordAnnotation(new Annotation.ServerSend());

      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = config => {
  return function*(next) {
    const traceId = yield beginTrace(this.request, config);
    this.state.traceId = traceId;
    yield next;
    yield endTrace(this.response, traceId);
  };
};
