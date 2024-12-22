function fn() {
  var env = karate.env; // get java system property 'karate.env'
  karate.log('karate.env system property was:', env);
  if (!env) {
    env = 'dev'; // a custom 'intelligent' default
  }
  var config = {
    baseUrl: 'http://localhost:8080/api'
  };
  if (env == 'dev') {
    // customize
    config.baseUrl = 'http://localhost:8080/api';
  } else if (env == 'test') {
    // customize for test environment
  }
  return config;
}
