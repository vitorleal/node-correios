let Correios = require('./index');
let correios = new Correios();

var args = {
  nCdServico: '04014,40215',
  sCepOrigem: '04563060',
  sCepDestino: '22421030',
  nVlPeso: 1,
};

correios.calcPreco(args)
  .then(result => { console.log(result) })
  .catch(error => { console.log(error) });

correios.consultaCEP({cep: '22421030'})
  .then(result => { console.log(result) })
  .catch(error => { console.log(error) });
