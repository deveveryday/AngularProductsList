const proxy = [
    {
      context: '/',
      target: 'http://10.123.52.131',
      pathRewrite: {'^/' : ''}
    }
  ];
  module.exports = proxy;