# Correios Node.js
[![Build Status](https://travis-ci.org/vitorleal/node-correios.svg?branch=master)](https://travis-ci.org/vitorleal/node-correios)
[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/vitorleal/node-correios)

[![NPM](https://nodei.co/npm/node-correios.png?mini=true)](https://nodei.co/npm/node-correios/)

Módulo de [Node.js](http://nodejs.org) que utilizar a API SOAP dos Correios para **calcular frete de envio** e **buscar endereço pelo CEP**.
[API dos Correios](http://www.correios.com.br/precos-e-prazos/calculador-remoto-de-precos-e-prazos)


## Como instalar

```
npm install node-correios --save
```

## Como utilizar o calculo de frete

```javascript
let Correios = require('node-correios');
let correios = new Correios();

correios.calcPreco(args)
.then(result => {
  console.log(result);
})
.catch(error => {
  console.log(error);
});
```

#### Respostas

Com sucesso:

```javascript
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

Com erro:

```javascript
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

Para consultar mais de um serviço na mesma requisição, basta passar vários códigos de serviço, separados por vírgula,
para o parâmetro `nCdServico` (ver descrição dos parâmetros abaixo). Neste caso, o array da resposta conterá um objeto
por cada código informado, sendo que alguns podem apresentar erro e outros podem ter tido sucesso.


```javascript
let args = {
	nCdServico: '40010,41106,40215',
	// demais parâmetros ...
}

correios.calcPreco(args)
.then(result => {
  console.log(result);
})
.catch(error => {
  console.log(error)
});
```

```javascript
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

Para executar o comando tem que enviar os campos **obrigatórios**. Para mais detalhes e informações veja o [PDF da API dos correios](http://www.correios.com.br/a-a-z/pdf/calculador-remoto-de-precos-e-prazos/manual-de-implementacao-do-calculo-remoto-de-precos-e-prazos)

###### Obrigatórios

- ``nCdServico`` - **String**

	Código do serviço:
	- 04014 = SEDEX à vista
	- 04065 = SEDEX à vista pagamento na entrega
	- 04510 = PAC à vista
	- 04707 = PAC à vista pagamento na entrega
	- 40169 = SEDEX12 ( à vista e a faturar)
	- 40215 = SEDEX 10 (à vista e a faturar)
	- 40290 = SEDEX Hoje Varejo

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
let Correios = require('node-correios');
let correios = new Correios();

correios.consultaCEP({ cep: '00000000' })
.then(result => {
  console.log(result);
})
.catch(error => {
  console.log(error;)
});
```

##### Resposta

```javascript
{
  bairro: 'Ipanema',
  cep: '22421030',
  localidade: 'Rio de Janeiro',
  logradouro: 'Rua Redentor',
  uf: 'RJ'
}
```


## Testes unitários

Para rodas os testes unitários:

```
$ npm test
```


## Autor

| [![twitter/vitorleal](http://gravatar.com/avatar/e133221d7fbc0dee159dca127d2f6f00?s=80)](http://twitter.com/vitorleal "Follow @vitorleal on Twitter") |
|---|
| [Vitor Leal](http://vitorleal.com) |


## Licença

Veja [LICENSE.txt](https://github.com/vitorleal/node-correios/blob/master/LICENSE.txt)

