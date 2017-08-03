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
  this.cepUrl       = 'https://apps.correios.com.br/SigepMasterJPA/AtendeClienteService/AtendeCliente?wsdl';

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
   cep: '',
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
      callback(err, result.CalcPrecoResult.Servicos.cServico);
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
      callback(err, result.CalcPrecoPrazoResult.Servicos.cServico);
    });
  });
};


/**
 * Search address by CEP
 * @param {object} args
 * @param {function} callback - Callback to execute after request
 * @example
 * ```
 * var args = {
 *   cep : 32114192
 * };
 *
 * correios.consultaCEP(args, function (err, result) {
 *   console.log(result);
 * });
 * ```
 */
Correios.prototype.consultaCEP = function (args, callback) {
    var arg = extend({}, this.cepArgs, args);

    soap.createClient(this.cepUrl, function (args, client) {
        client.consultaCEP(arg, function (err, result) {
            callback(err, result.return);
        });
    });
};

module.exports = Correios;

