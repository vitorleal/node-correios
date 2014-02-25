var soap   = require('soap'),
    events = require('events'),
    extend = require('extend'),
    help   = require('./help'),
    util   = require('util');


//Correios class
var Correios = function () {
  'use strict';

  this.url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';

  this.defaultArgs = {
    nCdEmpresa         : '',
    sDsSenha           : '',
    sCdMaoPropria      : 'N',
    nVlValorDeclarado  : 0,
    sCdAvisoRecebimento: 'N'
  };

  this.errorMessage = 'Erro no envio SOAP, verifique os campos enviados';
};

//Inherits from event emitter
util.inherits(Correios, events.EventEmitter);


//Calculate price
Correios.prototype.getPrice = function (args) {
  'use strict';

  var self = this,
      arg  = extend({}, this.defaultArgs, args);

  //create the SOAP client
  soap.createClient(this.url, function (err, client) {
    console.log(args);

    //call the calcPreco method from the api
    client.CalcPreco(arg, function (err, result) {
      if (!help.isNull(err)) {
        self.emit('error', { MsgErro: self.errorMessage });

      } else {
        self.emit('result', result.CalcPrecoResult.Servicos.cServico);
      }
    });
  });
};


//Syncronous calculate price
Correios.prototype.getPriceSync = function (args, callback) {
  'use strict';

  var self = this,
      arg  = extend({}, this.defaultArgs, args);

  //create the SOAP client
  soap.createClient(this.url, function (err, client) {
    //call the calcPreco method from the api
    client.CalcPreco(arg, function (err, result) {
      if (!help.isNull(err)) {
        callback({ MsgErro: self.errorMessage });

      } else {
        callback(result.CalcPrecoResult.Servicos.cServico);
      }
    });
  });
};

//Init method
Correios.init = function () {
  var correios = new this();

  correios.on('uncaughtException', function (e) {
    console.log(e);
  });

  return correios;
}

module.exports = Correios;
