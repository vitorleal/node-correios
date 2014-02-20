var soap = require('soap');

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
    nCdServico : '40010, 40045',
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


//Calculate price
Correios.prototype.getPrice = function () {
  'use strict';

  var self = this;

  soap.createClient(this.url, function (err, client) {
    client.CalcPreco(self.args, function (err, result) {
      return result.CalcPrecoResult.Servicos.cServico;
    });
  });
};
