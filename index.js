//module.exports = require('./lib/correios');
var Correios = require('./lib/correios.js'),
    correios = new Correios();

//executa o método de pesquisa de valor do frete
correios.consultaCEP({ cep: '04569001' });

//quando o evento result for emitido faz um log do retorno da api
correios.on('result', function (result) {
  console.log(result);
});

//se ocorreu algum erro na execução faz um log do erro
correios.on('error', function (err) {
  console.log(err);
});
