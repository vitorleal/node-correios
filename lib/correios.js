'use strict';

var soap  = require('soap'),
   extend = require('extend'),
  request = require('request');


/**
 * Correios class
 * @example
 * ```
 *  var Correios = require('node-correios'),
 *  correios = new Correios();
 *
 *  correios.calcPreco(args, function (err, result) {
 *    console.log(result);
 *  });
 * ```
 */
var Correios = function () {
  // If is not instance of Correios return a new instance
  if (false === (this instanceof Correios)) {
    return new Correios();
  }

  // Default URl's
  this.calcPrecoUrl = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
  this.cepUrl       = 'http://viacep.com.br/ws/{CEP}/json';

  // Default args for price calculation
  this.calcArgs = {
    nCdEmpresa         : '',
    sDsSenha           : '',
    sCdMaoPropria      : 'N',
    nVlValorDeclarado  : 0,
    sCdAvisoRecebimento: 'N'
  };

  // Default args for CEP search
  this.cepArgs = {
    cepEntrada: '',
    metodo    : 'buscarCep'
  };
};


/**
 * Calcularte price with shipping
 * @param {object} args
 * @param {function} callback - Callback to execute after request
 * @example
 * ```
 * var args = {
 *   nCdServico: '40010,41106,40215',
 *   // demais parâmetros ...
 * };
 *
 * correios.calcPreco(args, function (err, result) {
 *   console.log(result);
 * });
 * ```
 */
Correios.prototype.calcPreco = function(args, callback) {
  var arg = extend({}, this.calcArgs, args);

  // create the SOAP client
  soap.createClient(this.calcPrecoUrl, function(err, client) {
    client.CalcPreco(arg, function (err, result) {
      if (result && result.CalcPrecoResult && result.CalcPrecoResult.Servicos && result.CalcPrecoResult.Servicos.cServico) {
        callback(err, result.CalcPrecoResult.Servicos.cServico);
      } else {
        callback(err, null);
      }
    });
  });
};


/**
 * Calculate price and estimate delivery time
 * @param {object} args
 * @param {function} callback - Callback to execute after request
 * @example
 * ```
 * var args = {
 *   nCdServico: '40010,41106,40215',
 *   // demais parâmetros ...
 * };
 *
 * correios.calcPrecoPrazo(args, function (err, result) {
 *   console.log(result);
 * });
 * ```
 */
Correios.prototype.calcPrecoPrazo = function(args, callback) {
  var arg = extend({}, this.calcArgs, args);

  // create the SOAP client
  soap.createClient(this.calcPrecoUrl, function(err, client) {
    client.CalcPrecoPrazo(arg, function (err, result) {
       if (result && result.CalcPrecoPrazoResult && result.CalcPrecoPrazoResult.Servicos && result.CalcPrecoPrazoResult.Servicos.cServico) {
            callback(err, result.CalcPrecoPrazoResult.Servicos.cServico);
       } else {
          throw 'Servidor do correios fora do ar'
       }
    });
  });
};


/**
 * Search for address by CEP
 * @param {object} args
 * @param {function} callback - Callback to execute after request
 * @example
 * ```
 *  var Correios = require('node-correios'),
 *  correios = new Correios();
 *
 *  correios.consultaCEP({ cep: '00000000' }, function(err, result) {
 *    console.log(result)
 *  });
 * ```
 */
Correios.prototype.consultaCEP = function(args, callback) {
  var arg = extend({}, args);

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

