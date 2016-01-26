var should   = require('should'),
    events   = require('events'),
    Correios = require('../lib/correios'),
    correios;

beforeEach(function() {
  correios = new Correios();
});

describe('Correios class', function() {
  it('should be an instance of Correios class', function() {
    var correiosInstance = Correios(),
        newCorreiosInstance = new Correios();

    correiosInstance.should.be.an.instanceOf(Correios);
    newCorreiosInstance.should.be.an.instanceOf(Correios);
  });

  it('should have the correios WSDL urls', function() {
    correios.calcPrecoUrl.should.eql('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl');
    correios.cepUrl.should.eql('http://cep.correiocontrol.com.br/{CEP}.json');
  });

  it('should have default calculation arguments "calcArgs"', function() {
    correios.calcArgs.should.have.property('nCdEmpresa', '');
    correios.calcArgs.should.have.property('sDsSenha', '');
    correios.calcArgs.should.have.property('sCdMaoPropria', 'N');
    correios.calcArgs.should.have.property('nVlValorDeclarado', 0);
    correios.calcArgs.should.have.property('sCdAvisoRecebimento', 'N');
  });

  it('should have default address lookup arguments "cepArgs"', function() {
    correios.cepArgs.should.have.property('cepEntrada', '');
    correios.cepArgs.should.have.property('metodo', 'buscarCep');
  });

  it('should have default address lookup arguments "cepArgs"', function() {
    correios.cepArgs.should.have.property('cepEntrada', '');
    correios.cepArgs.should.have.property('metodo', 'buscarCep');
  });
});

describe('Correios prototype', function() {
  it('should have validArg', function() {
    correios.should.have.property('validArg').which.is.a.Function;
  });
  it('should have calcPreco', function() {
    correios.should.have.property('calcPreco').which.is.a.Function;
  });
  it('should have calcPrecoPrazo', function() {
    correios.should.have.property('calcPrecoPrazo').which.is.a.Function;
  });

  it('should have consultaCEP', function() {
    correios.should.have.property('consultaCEP').which.is.a.Function;
  });

  it('should throw exception if no CEP is passed in the arguments { cep: 00000000 }', function() {
    (function() {
      correios.consultaCEP();
    }).should.throw();
  });

  it('should not throw exception if CEP is passed in the arguments { cep: 00000000 }', function() {
    (function() {
      correios.consultaCEP({ cep: '00000000' });
    }).should.not.throw();
  });

  it('should throw exception if some of require fields is not passed in the arguments {ex: missing nCdServico }', function() {
    (function() {
      var args = {
        sCepOrigem: '31275000',
        sCepDestino:'32400000',
        nVlPeso :'0.300',
        nCdFormato :'3',
        nVlComprimento : 30.0,
        nVlAltura : 3,
        nVlLargura : 30.0,
        nVlDiametro :30.0,
        zeta:123
      }
      correios.calcPrecoPrazo(args);
    }).should.throw();
  });

  it('should not throw exception if all fields is passed in the arguments and the type is right', function() {
    (function() {
      var args = {
        nCdServico: '40010,41106,40215',
        sCepOrigem: '31275000',
        sCepDestino:'32400000',
        nVlPeso :'0.300',
        nCdFormato :3,
        nVlComprimento : 30.0,
        nVlAltura : 3,
        nVlLargura : 30.0,
        nVlDiametro :30.0,
        zeta:123
      }
      correios.calcPrecoPrazo(args);
    }).should.not.throw();
  });

   it('should throw exception if nCdFormato is setted as 3 and nVlPeso is greater then 1', function() {
    (function() {
      var args = {
        nCdServico: '40010,41106,40215',
        sCepOrigem: '31275000',
        sCepDestino:'32400000',
        nVlPeso :'2.300',
        nCdFormato :3,
        nVlComprimento : 30.0,
        nVlAltura : 3,
        nVlLargura : 30.0,
        nVlDiametro :30.0,
        zeta:123
      }
      correios.calcPrecoPrazo(args);
    }).should.throw();
  });
  it('should throw exception if the type of some required field ir wrong. Ex: nCdFormato as  string', function() {
    (function() {
      var args = {
        nCdServico: '40010,41106,40215',
        sCepOrigem: '31275000',
        sCepDestino:'32400000',
        nVlPeso :'2.300',
        nCdFormato :'3',
        nVlComprimento : 30.0,
        nVlAltura : 3,
        nVlLargura : 30.0,
        nVlDiametro :30.0,
        zeta:123
      }
      correios.calcPrecoPrazo(args);
    }).should.throw();
  });
});
