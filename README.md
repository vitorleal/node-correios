# Correios Node.js

[![Build Status](https://travis-ci.org/vitorleal/node-correios.svg?branch=master)](https://travis-ci.org/vitorleal/node-correios)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/vitorleal/node-correios)
[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/vitorleal/node-correios)

[![NPM](https://nodei.co/npm/node-correios.png?mini=true)](https://nodei.co/npm/node-correios/)

Módulo de [Node.js](http://nodejs.org) que utilizar a API SOAP dos Correios para **calcular frete de envio** e **buscar endereço pelo CEP**.
[API dos Correios](http://www.correios.com.br/para-voce/correios-de-a-a-z/pdf/calculador-remoto-de-precos-e-prazos/manual-de-implementacao-do-calculo-remoto-de-precos-e-prazos)


## APP de Exemplo

- Calcular frete - [link](http://correios-server.herokuapp.com/frete?nCdServico=40010,40045&sCepOrigem=22041030&sCepDestino=04569001&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=4&nVlLargura=11&nVlDiametro=20&nVlValorDeclarado=500)
- Calcular frete/prazo - [link](http://correios-server.herokuapp.com/frete/prazo?nCdServico=40010,40045&sCepOrigem=22041030&sCepDestino=04569001&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=4&nVlLargura=11&nVlDiametro=20&nVlValorDeclarado=500)
- Buscar Cep - [link](http://correios-server.herokuapp.com/cep/22421010)


## Como instalar

Basta utilizar o [NPM](npmjs.org) com a *flag* **--save** para guardar como dependência no seu **package.json**

```
npm install node-correios --save
```


## Como utilizar o calculo de frete

```javascript
var Correios = require('node-correios'),
    correios = new Correios();

correios.calcPreco(args, function (err, result) {
  console.log(result);
});

//Com promises

correios.calcPreco(args).then(result => console.log(result));


```

##### Exemplo de resultado

Caso a consulta tenha sucesso, o `callback` receberá um objeto como segundo parâmetro, similar a:

```
[{
	Codigo: 40010,
	Valor: '23,30',
	ValorMaoPropria: '0,00',
	ValorAvisoRecebimento: '0,00',
	ValorValorDeclarado: '0,00',
	Erro: '0',
	MsgErro: {}
}]
```

Caso algum parâmetro esteja errado, ou o serviço esteja indisponível para o CEP de destino, o objeto retornado no
`callback` conterá a propriedade `Erro` como um código de erro e conterá uma mensagem de erro no parâmetro `MsgErro`.

```
[{
	Codigo: 40215,
	Valor: '0',
	ValorMaoPropria: '0',
	ValorAvisoRecebimento: '0',
	ValorValorDeclarado: '0',
	Erro: '008',
	MsgErro: 'Serviço indisponível para o trecho informado.',
	ValorSemAdicionais: '0'
}]
```

Em caso de erro na consulta ao WebService dos Correios, o `callback` receberá o erro como primeiro parâmetro.

Para consultar mais de um serviço na mesma requisição, basta passar vários códigos de serviço, separados por vírgula,
para o parâmetro `nCdServico` (ver descrição dos parâmetros abaixo). Neste caso, o array da resposta conterá um objeto
por cada código informado, sendo que alguns podem apresentar erro e outros podem ter tido sucesso.


``` javascript
var args = {
	nCdServico: '40010,41106,40215',
	// demais parâmetros ...
}

correios.calcPreco(args, function (err, result) {
	console.log(result);
});

// result:
[{
	Codigo: 40010,
	Valor: '24,10',
	ValorMaoPropria: '0,00',
	ValorAvisoRecebimento: '0,00',
	ValorValorDeclarado: '0,00',
	Erro: {},
	MsgErro: {},
	ValorSemAdicionais: '24,10'
},{
	Codigo: 41106,
	Valor: '16,80',
	ValorMaoPropria: '0,00',
	ValorAvisoRecebimento: '0,00',
	ValorValorDeclarado: '0,00',
	Erro: {},
	MsgErro: {},
	ValorSemAdicionais: '16,80'
},{
	Codigo: 40215,
	Valor: '0',
	ValorMaoPropria: '0',
	ValorAvisoRecebimento: '0',
	ValorValorDeclarado: '0',
	Erro: '008',
	MsgErro: 'Serviço indisponível para o trecho informado.',
	ValorSemAdicionais: '0'
}]
```


### Métodos

Os métodos implementados são: calcPreco e calcPrecoPrazo

##### correios.calcPreco(args);

##### correios.calcPrecoPrazo(args);

Para executar o comando tem que enviar os campos **obrigatórios**. Para mais detalhes e informações veja o [PDF da API dos correios](http://www.correios.com.br/para-voce/correios-de-a-a-z/pdf/calculador-remoto-de-precos-e-prazos/manual-de-implementacao-do-calculo-remoto-de-precos-e-prazos)

###### Obrigatórios

- ``nCdServico`` - **String**

	Código do serviço:
	- 40010 = SEDEX Varejo
	- 40045 = SEDEX a Cobrar Varejo
	- 40215 = SEDEX 10 Varejo
	- 40290 = SEDEX Hoje Varejo
	- 41106 = PAC Varejo

- ``sCepOrigem`` - **String**

	CEP de Origem sem hífen. Exemplo: **05311900**

- ``sCepDestino`` - **String**

	CEP de Destino sem hífen

- ``nVlPeso`` - **String**

	Peso da encomenda, incluindo sua embalagem. O peso deve ser informado em quilogramas. Se o formato for Envelope, o valor máximo permitido será 1 kg

- ``nCdFormato`` - **Inteiro**

	Formato da encomenda (incluindo embalagem)
	- 1 = Formato caixa/pacote
	- 2 = Formato rolo/prisma
	- 3 = Envelope

- ``nVlComprimento`` - **Decimal**

	Comprimento da encomenda (incluindo embalagem), em centímetros

- ``nVlAltura`` - **Decimal**

	Altura da encomenda (incluindo embalagem), em centímetros. Se o formato for envelope, informar zero (0)

- ``nVlLargura`` - **Decimal**

	Largura da encomenda (incluindo embalagem), em centímetros

- ``nVlDiametro`` - **Decimal**

	Diâmetro da encomenda (incluindo embalagem), em centímetros

###### Não obrigatórios
- ``nCdEmpresa`` - **String**

	Seu código administrativo junto à ECT. O código está disponível no corpo do contrato firmado com os Correios

- ``sDsSenha`` - **String**

	Senha para acesso ao serviço, associada ao seu código administrativo. A senha inicial corresponde aos 8 primeiros dígitos do CNPJ informado no contrato

- ``sCdMaoPropria`` - **String**

	Indica se a encomenda será entregue com o serviço adicional mão própria
	- S = sim
	- N = não **PADRÃO**


- ``nVlValorDeclarado`` - **Decimal**

	Indica se a encomenda será entregue com o serviço adicional valor declarado. Neste campo deve ser apresentado o valor declarado desejado, em Reais

- ``sCdAvisoRecebimento`` - **String**

	Indica se a encomenda será entregue com o serviço adicional mão própria
	- S = sim
	- N = não **PADRÃO**


## Como utilizar a buscar por CEP

```javascript
var Correios = require('node-correios'),
    correios = new Correios();

correios.consultaCEP({ cep: '00000000' }, function(err, result) {
  console.log(result)
});

//Ou

correios.consultaCEP({ cep: '00000000' }).then(result => console.log(result));

```



##### Exemplo de resultado

Caso a consulta tenha sucesso, o `callback` receberá um objeto como segundo parâmetro, similar a:

```
{
  bairro: 'Ipanema',
  cep: '22421030',
  localidade: 'Rio de Janeiro',
  logradouro: 'Rua Redentor',
  uf: 'RJ'
}
```

Em caso de erro na consulta ao WebService dos Correios, o `callback` receberá o erro ocorrido como primeiro parâmetro.


## Testes unitários

Para rodas os testes unitários, depois de instalar as dependências do projeto com o ```npm install```, execute o comando:

```
$ npm test
```

Para incluir seus testes unitários, eles se encontram na pasta ```./test```


## Contribuições

Para contribuir com o projeto basta seguir as seguintes intruções: [Link](https://github.com/vitorleal/node-correios/wiki/Contribui%C3%A7%C3%B5es)


## Autor

| [![twitter/vitorleal](http://gravatar.com/avatar/e133221d7fbc0dee159dca127d2f6f00?s=80)](http://twitter.com/vitorleal "Follow @vitorleal on Twitter") |
|---|
| [Vitor Leal](http://vitorleal.com) |


## Licença

Veja [LICENSE.txt](https://github.com/vitorleal/node-correios/blob/master/LICENSE.txt)

