let soap    = require('soap');
let request = require('request');

module.exports = class Correios {
  constructor(width) {
    this.calcPrecoUrl = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
    this.cepUrl       = 'http://viacep.com.br/ws/{CEP}/json';
    this.calcArgs     = {
      nCdEmpresa         : '',
      sDsSenha           : '',
      sCdMaoPropria      : 'N',
      nVlValorDeclarado  : 0,
      sCdAvisoRecebimento: 'N'
    };
  }

  calcPreco(args) {
    let arg = Object.assign({}, this.calcArgs, args);

    return new Promise((resolve, reject) => {
      soap.createClient(this.calcPrecoUrl, (error, client) => {
        if ( error ) return reject(error);
        client.CalcPreco(arg, (error, result) => {
          if (!error
            && result && result.CalcPrecoResult
            && result.CalcPrecoResult.Servicos
            && result.CalcPrecoResult.Servicos.cServico) {

            return resolve(result.CalcPrecoResult.Servicos.cServico);
          }

          return reject(error);
        });
      });
    })
  }

  calcPrecoPrazo(args) {
    let arg = Object.assign({}, this.calcArgs, args);

    return new Promise((resolve, reject) => {
      soap.createClient(this.calcPrecoUrl, (error, client) => {
        if ( error ) return reject(error);
        client.CalcPrecoPrazo(arg, (error, result) => {
          if (!error
            && result && result.CalcPrecoPrazoResult
            && result.CalcPrecoPrazoResult.Servicos
            && result.CalcPrecoPrazoResult.Servicos.cServico) {

            return resolve(result.CalcPrecoPrazoResult.Servicos.cServico)
          }

          return reject(error);
        });
      });
    });
  }

  consultaCEP(args) {
    let arg = Object.assign({}, args);

    if ('cep' in arg === false) {
      throw new Error('You need to inform a CEP ex: { cep: 00000000 }');
    }

    return new Promise((resolve, reject) => {
      let url = this.cepUrl.replace('{CEP}', arg.cep.replace('-', ''));

      request(url, (error, resp, body) => {
        if (error) {
          return reject(error);
        }

        try {
          return resolve(JSON.parse(body))

        } catch (e) {
          return reject({
            Erro: 404,
            MsgErro: 'Cep não encontrado'
          });
        }
      });
    });
  }
}
