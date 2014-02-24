var soap   = require('soap'),
    events = require('events'),
    extend = require('node.extend'),
    util   = require('util');

//Correios class
var Correios = function () {
  'use strict';

  this.url         = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
  this.defaultArgs = {
    nCdEmpresa         : '',
    sDsSenha           : '',
    sCdMaoPropria      : 'N',
    nVlValorDeclarado  : 0,
    sCdAvisoRecebimento: 'N'
  };
};

//Inherits from event emitter
util.inherits(Correios, events.EventEmitter);


//Calculate price
Correios.prototype.getPrice = function (args) {
  'use strict';

  var self = this,
      arg  = extend(this.defaultArgs, args);

  //create the SOAP client
  soap.createClient(this.url, function (err, client) {
    if (!self.isNull(err)) {
      self.emit('error', { MsgErro: 'Erro ao criar SOAP client' });
      return;
    }

    //call the calcPreco method from the api
    client.CalcPreco(arg, function (err, result) {
      if (!self.isNull(err)) {
        self.emit('error', { MsgErro: 'Erro no envio SOAP, verifique os campos enviados' });

      } else {
        self.emit('result', result.CalcPrecoResult.Servicos.cServico);
      }
    });
  });
};


//Is null
Correios.prototype.isNull = function(e) {
  'use strict';

  return e === null;
};

module.exports = Correios;
