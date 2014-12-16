var soap    = require('soap'),
    events  = require('events'),
    extend  = require('extend'),
    cheerio = require('cheerio'),
    request = require('request'),
    _       = require('underscore'),
    help    = require('./help'),
    util    = require('util');


//Correios class
var Correios = function () {
  'use strict';

  //If is not instance of Correios return a new instance
  if (false === (this instanceof Correios)) {
    return new Correios();
  }

  events.EventEmitter.call(this);

  //Default URl's
  this.calcPrecoUrl = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
  this.cepUrl       = 'http://m.correios.com.br/movel/buscaCepConfirma.do';

  //Default args for price calculation
  this.calcArgs = {
    nCdEmpresa         : '',
    sDsSenha           : '',
    sCdMaoPropria      : 'N',
    nVlValorDeclarado  : 0,
    sCdAvisoRecebimento: 'N'
  };

  //Default args for CEP search
  this.cepArgs = {
    cepEntrada: '',
    metodo    : 'buscarCep'
  };

  this.errorMessage = 'Erro no envio SOAP, verifique os campos enviados';
};

//Inherits from event emitter
util.inherits(Correios, events.EventEmitter);


//Calculate price
Correios.prototype.calcPreco = function (args, callback) {
  'use strict';

  var _this = this,
      arg   = extend({}, this.calcArgs, args);

  //create the SOAP client
  soap.createClient(this.calcPrecoUrl, function (err, client) {
    client.CalcPreco(arg, function (err, result) {
      if (!help.isNull(err)) {
        if (callback) {
          callback({ MsgErro: _this.errorMessage });

        } else {
          _this.emit('error', { MsgErro: _this.errorMessage });
        }

      } else {
        if (callback) {
          callback(result.CalcPrecoResult.Servicos.cServico);

        } else {
          _this.emit('result', result.CalcPrecoResult.Servicos.cServico);
        }
      }
    });
  });
};


//Calculate price and delivery time
Correios.prototype.calcPrecoPrazo = function (args, callback) {
  'use strict';

  var _this = this,
      arg   = extend({}, this.calcArgs, args);

  //create the SOAP client
  soap.createClient(this.calcPrecoUrl, function (err, client) {
    client.CalcPrecoPrazo(arg, function (err, result) {
      if (!help.isNull(err)) {
        if (callback) {
          callback({ MsgErro: _this.errorMessage });

        } else {
          _this.emit('error', { MsgErro: _this.errorMessage });
        }

      } else {
        if (callback) {
          callback(result.CalcPrecoPrazoResult.Servicos.cServico);

        } else {
          _this.emit('result', result.CalcPrecoPrazoResult.Servicos.cServico);
        }
      }
    });
  });
};


//Get address by CEP
Correios.prototype.consultaCEP = function (args, callback) {
  'use strict';

  var _this = this,
       arg  = extend({}, args);

  if ('cep' in arg == false) {
    throw new Error('You need to inform a CEP');
  }

  this.cepArgs.cepEntrada = arg.cep;

  //Make post request to the correios CEP url
  request.post({
    url     : this.cepUrl,
    form    : this.cepArgs,
    encoding: 'binary'

  }, function (err, resp, body) {
    //If error
    if (err) {
      if (err.code == 'ENOTFOUND') {
        if (callback) {
          return callback({
            Erro: 500,
            MsgError: 'Sem conexão com a internet'
          });

        } else {
          return _this.emit('error', {
            Erro: 500,
            MsgError: 'Sem conexão com a internet'
          });
        }
      }
    }

    //If respnse is 200 oK
    if (resp.statusCode === 200) {
      var $ = cheerio.load(body);

      //If result
      if ($('.caixacampoazul')) {
        var keys, vals;

        keys = $('.resposta').map(function (i, el) {
          var text = $(this).text().toLowerCase();
          text = text.charAt(0).toUpperCase() + text.slice(1);

          return text.replace(':', '').replace(/\s/g, '').replace('/uf', '')
        }).get();

        vals = $('.respostadestaque').map(function (i, el) {
          var text = $(this).text().trim();
          return text.replace(/(\r\n|\n|\r|\t)/gm, '').replace(/ +/g, ' ');
        }).get();

        //If any key
        if (keys.length) {
          if (callback) {
            return callback(_.object(keys, vals));

          } else {
            return _this.emit('result', _.object(keys, vals));
          }
        }

        if (callback) {
          return callback({
            Erro: 404,
            MsgError: 'CEP não encontrado'
          });

        } else {
          return _this.emit('error', {
            Erro: 404,
            MsgError: 'CEP não encontrado'
          });
        }
      }

    } else {
      if (callback) {
        return callback(resp);

      } else {
        return _this.emit('error', resp);
      }
    }
  });
};


module.exports = Correios;

