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

//Correios class
Correios.prototype = {
  //Calculate price
  calcPreco: function (args, callback) {
    'use strict';

    var self = this,
        arg  = extend({}, this.defaultArgs, args);

    //create the SOAP client
    soap.createClient(this.url, function (err, client) {
      client.CalcPreco(arg, function (err, result) {
        if (!help.isNull(err)) {
          if (callback) {
            callback({ MsgErro: self.errorMessage });

          } else {
            self.emit('error', { MsgErro: self.errorMessage });
          }

        } else {
          if (callback) {
            callback(result.CalcPrecoResult.Servicos.cServico);

          } else {
            self.emit('result', result.CalcPrecoResult.Servicos.cServico);
          }
        }
      });
    });
  },

  //Calculate price and delivery time
  calcPrecoPrazo: function (args, callback) {
    'use strict';

    var self = this,
        arg  = extend({}, this.defaultArgs, args);

    //create the SOAP client
    soap.createClient(this.url, function (err, client) {
      client.CalcPrecoPrazo(arg, function (err, result) {
        if (!help.isNull(err)) {
          if (callback) {
            callback({ MsgErro: self.errorMessage });

          } else {
            self.emit('error', { MsgErro: self.errorMessage });
          }

        } else {
          if (callback) {
            callback(result.CalcPrecoResult.Servicos.cServico);

          } else {
            self.emit('result', result.CalcPrecoResult.Servicos.cServico);
          }
        }
      });
    });
  }
};

module.exports = Correios;
