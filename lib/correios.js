var soap    = require('soap'),
    extend  = require('extend'),
    request = require('request');

// Correios class
var Correios = function() {
  'use strict';

  // If is not instance of Correios return a new instance
  if (false === (this instanceof Correios)) {
    return new Correios();
  }

  // Default URl's
  this.calcPrecoUrl = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
  this.cepUrl = 'http://cep.correiocontrol.com.br/{CEP}.json';

  // Default args for price calculation
  this.calcArgs = {
    nCdEmpresa: '',
    sDsSenha: '',
    sCdMaoPropria: 'N',
    nVlValorDeclarado: 0,
    sCdAvisoRecebimento: 'N'
  };

  // Default args for CEP search
  this.cepArgs = {
    cepEntrada: '',
    metodo: 'buscarCep'
  };
};

// Calculate price
Correios.prototype.calcPreco = function(args, callback) {
  'use strict';

  var arg = extend({}, this.calcArgs, args);

  // create the SOAP client
  soap.createClient(this.calcPrecoUrl, function(err, client) {
    client.CalcPreco(arg, function (err, result) {
      callback(err, result.CalcPrecoResult.Servicos.cServico);
    });
  });
};

// Calculate price and delivery time
Correios.prototype.calcPrecoPrazo = function(args, callback) {
  'use strict';

  var arg   = extend({}, this.calcArgs, args);

  // create the SOAP client
  soap.createClient(this.calcPrecoUrl, function(err, client) {
    client.CalcPrecoPrazo(arg, function (err, result) {
      callback(err, result.CalcPrecoPrazoResult.Servicos.cServico);
    });
  });
};

// Search for address using cep
Correios.prototype.consultaCEP = function(args, callback) {
  'use strict';

  var arg   = extend({}, args);

  if ('cep' in arg === false) {
    return callback(new Error('You need to inform a CEP ex: { cep: 00000000 }'));
  }

  // make request to the cep api
  var url = this.cepUrl.replace('{CEP}', arg.cep.replace('-', ''));

  request(url, function(err, resp, body) {
    if (err) {
      return callback(err);
    }

    try {
      callback(null, JSON.parse(body));
    } catch (e) {
      callback({
        Erro: 404,
        MsgErro: 'Cep não encontrado'
      });
    }
  });
};

module.exports = Correios;
