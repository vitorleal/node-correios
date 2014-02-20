var soap   = require('soap'),
    events = require('events'),
    util   = require('util');

//Correios class
var Correios = function () {
  'use strict';

  this.url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';

  //Services
  this.services = {
    sedex  : '40010',
    aCobrar: '40045',
    sedex10: '40215',
    sedexHj: '40290',
    pac    : '41106'
  };

  //Format
  this.format = {
    caixaPacote: 1,
    roloPrisma : 2,
    envelope   : 3
  };

  //Default Args
  this.args = {
    nCdEmpresa : '',
    sDsSenha   : '',
    nCdServico : '40010',
    sCepOrigem : '22041030',
    sCepDestino: '04569001',
    nVlPeso    : '1',
    nCdFormato : 1,
    nVlComprimento: 20,
    nVlAltura  : 4,
    nVlLargura : 10,
    nVlDiametro: 20,
    sCdMaoPropria: 'N',
    nVlValorDeclarado: 0,
    sCdAvisoRecebimento: 'N'
  };
};

//Inherits from event emitter
util.inherits(Correios, events.EventEmitter);


//Calculate price
Correios.prototype.getPrice = function (args) {
  'use strict';

  var self = this;

  //if not error and not required fields emit an error
  if (!args || !args.sCepOrigem) {
    throw new Error('Envie todos os campos obrigatórios');
  }

  //create the SOAP client
  soap.createClient(this.url, function (err, client) {
    if (err) {
      self.emit('error', err);
    }

    //call the calcPreco method from the api
    client.CalcPreco(self.args, function (err, result) {
      //if error
      if (err) {
        self.emit('error', err);

      } else {
        self.emit('result', result.CalcPrecoResult.Servicos.cServico);
      }
    });
  });
};

module.exports = Correios;
