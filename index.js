/*
 * Hello World!
 * First exercise for the Pirple.com Node MasterClass
 */

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

var server = http.createServer((req,res)=>{
  var parsedUrl = url.parse(req.url,true);
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');
  var method = req.method.toLowerCase();
  var queryStringObject = parsedUrl.query;
  var headers = req.headers;
  var decoder = new StringDecoder('utf-8');

  var buffer = '';

  req.on('data', (data)=>{
    buffer += decoder.write(data);
  });
  req.on('end',()=>{
    buffer += decoder.end();
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    var data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      'payload': buffer
    };

    chosenHandler(data, (statusCode, payload)=>{
      statusCode = typeof(statusCode) == 'number' ? statusCode : 500;
      payload = typeof(payload) == 'object' ? payload : {};
      var payloadString = JSON.stringify(payload);
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('Sending Response to the server:\n',
                  'Status Code: ' + statusCode + '\n',
                  'Message: ' + payloadString +  '\n')
    })
  });
});

server.listen(9000, ()=>{
  console.log("Server is listening on port 9000")
});

var handlers = {};

handlers.hello = (data,callback)=>{
  if(data.method === 'get'){
    callback(200, {"Greetings": "Hello World!",
                   "Your_query": data.queryStringObject,
                   "method_used": data.method
                  })
  } else {
    callback(200, {"Greetings": "Hello World!",
                   "Your_query": data.queryStringObject,
                   "method_used": data.method,
                   "Your_mesage": data.payload
                  })
  }
};

handlers.notFound = (data,callback)=>{
  callback(404, {"Error": "Try 'http://localhost:9000/hello'"})
}

var router = {
  'hello' : handlers.hello
};
