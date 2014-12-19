var should   = require('should'),
    events   = require('events'),
    Correios = require('../lib/correios'),
    correios;

beforeEach(function () {
  correios = new Correios();
});

describe('Correios', function () {
   it('should be an instance of Correios class', function () {
    var correiosInstance = Correios(),
        newCorreiosInstance = new Correios();

    correiosInstance.should.be.an.instanceOf(Correios);
    newCorreiosInstance.should.be.an.instanceOf(Correios);
  });

  it('should be an instance of EventEmitter', function () {
    correios.should.be.an.instanceOf(events.EventEmitter);
  });

  it('should have the correios WSDL urls', function () {
    correios.calcPrecoUrl.should.eql('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl');
    correios.cepUrl.should.eql('http://200.252.60.209/SigepCliente/AtendeClienteService?wsdl');
  });

  it('should have default calculation arguments "calcArgs"', function () {
    correios.calcArgs.should.have.property('nCdEmpresa', '');
    correios.calcArgs.should.have.property('sDsSenha', '');
    correios.calcArgs.should.have.property('sCdMaoPropria', 'N');
    correios.calcArgs.should.have.property('nVlValorDeclarado', 0);
    correios.calcArgs.should.have.property('sCdAvisoRecebimento', 'N');
  });

  it('should have default address lookup arguments "cepArgs"', function () {
    correios.cepArgs.should.have.property('cepEntrada', '');
    correios.cepArgs.should.have.property('metodo', 'buscarCep');
  });
});
