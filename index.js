//module.exports = require('./lib/correios');
var Correios = require('./lib/correios'),
    correios = new Correios();

correios.consultaCEP({ 'cep': '0456901' });

correios.on('result', function (result) {
  console.log(result);
});

correios.on('error', function (err) {
  console.log(err);
});
