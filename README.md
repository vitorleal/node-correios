# Correios Node.js

[![Build Status](https://travis-ci.org/vitorleal/node-correios.svg?branch=master)](https://travis-ci.org/vitorleal/node-correios)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

[![NPM](https://nodei.co/npm/node-correios.png)](https://nodei.co/npm/node-correios/)

Módulo de [Node.js](http://nodejs.org) que utilizar a API SOAP dos Correios para **calcular frete de envio** e **buscar endereço pelo CEP**.
[API dos Correios](http://www.correios.com.br/webServices/PDF/SCPP_manual_implementacao_calculo_remoto_de_precos_e_prazos.pdf)


## APP de Exemplo

[App de exemplo do node-correios](http://correios-server.herokuapp.com/frete?nCdServico=40010,40045&sCepOrigem=22041030&sCepDestino=04569001&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=4&nVlLargura=11&nVlDiametro=20&nVlValorDeclarado=500)


## Como instalar

Basta utilizar o [NPM](npmjs.org) com a *flag* **--save** para guardar como dependência no seu **package.json**

```
npm install node-correios --save
```


## Como utilizar o calculo de frete

```javascript
var Correios = require('node-correios'),
    correios = new Correios();

//executa o método de pesquisa de valor do frete
correios.calcPreco(args);

//quando o evento result for emitido faz um log do retorno da api
correios.on('result', function (result) {
  console.log(result);
});

//se ocorreu algum erro na execução faz um log do erro
correios.on('error', function (err) {
  console.log(err);
});

//você também pode utilize um callback
correios.calcPreco(args, function (result) {
  console.log(result);
});

```

### Calcupar preço do frete

No exemplo anterior a variável **correios** é um objeto *[EventEmiter](http://nodejs.org/api/events.html)*. Você pode "escutar" pelos seguintes eventos:

- ```result``` - Array com o resultado da pesquisa

##### Exemplo de resultado

Retorno com **sucesso**

```
[{
	Codigo: 40010,
	Valor: '23,30',
	ValorMaoPropria: '0,00',
	ValorAvisoRecebimento: '0,00',
	ValorValorDeclarado: '0,00',
	Erro: {},
	MsgErro: {}
}]
```

Retorno com **erro**

```
[{
	Codigo: 40010,
	Valor: '0,00',
	ValorMaoPropria: '0,00',
	ValorAvisoRecebimento: '0,00',
	ValorValorDeclarado: '0,00',
	Erro: '-20',
	MsgErro: 'A largura nao pode ser inferior a 11 cm.'
}]
```

- ```error```  - Retorna o erro ocorrido na execução

##### Exemplo de erro

```
Envie todos os campos obrigatórios
```

### Métodos

Os métodos implementados são: calcPreco e calcPrecoPrazo

##### correios.calcPreco(args);

##### correios.calcPrecoPrazo(args);

Para executar o comando tem que enviar os campos **obrigatórios**. Para mais detalhes e informações veja o [PDF da API dos correios](http://www.correios.com.br/webServices/PDF/SCPP_manual_implementacao_calculo_remoto_de_precos_e_prazos.pdf)

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

//Buscar endereço pelo CEP
correios.consultaCEP({ cep: '00000000' });

//quando o evento result for emitido faz um log do retorno da api
correios.on('result', function (result) {
  console.log(result);
});

//se ocorreu algum erro na execução faz um log do erro
correios.on('error', function (err) {
  console.log(err);
});

//você também pode utilize um callback
correios.consultaCEP({ cep: '00000000' }, function(result) {
  console.log(result)
});

```

No exemplo anterior a variável **correios** é um objeto *[EventEmiter](http://nodejs.org/api/events.html)*. Você pode "escutar" pelos seguintes eventos:

- ```result``` - Objecto com o resultado da pesquisa

##### Exemplo de resultado

Retorno com **sucesso**

```
{
  bairro: 'Ipanema',
  cep: '22421030',
  localidade: 'Rio de Janeiro',
  logradouro: 'Rua Redentor',
  uf: 'RJ'
}
```

Retorno com **erro**

```
{
  Erro: 404,
  MsgError: 'Cep não encontrado'
}

```

## Autor

| [![twitter/vitorleal](http://gravatar.com/avatar/e133221d7fbc0dee159dca127d2f6f00?s=80)](http://twitter.com/vitorleal "Follow @vitorleal on Twitter") |
|---|
| [Vitor Leal](http://vitorleal.com) |

## Licença

Veja [LICENSE.txt](https://github.com/vitorleal/node-correios/blob/master/LICENSE.txt)
