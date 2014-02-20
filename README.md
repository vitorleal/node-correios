#Correios NodeJS

Módulo de [nodeJS](http://nodejs.org) que utiliza a API dos Correios para calcular frete de envio.
[API dos Correios](http://www.correios.com.br/webServices/PDF/SCPP_manual_implementacao_calculo_remoto_de_precos_e_prazos.pdf)



##Como instalar

Para instalar é bem simples. Basta utilizar o [NPM](npmjs.org) utilizando a *flag* **--save** para guardar como dependência no seu **package.json**

```
npm install correios --save
```


##Como utilizar


```
var Correios = require('./lib/correios'),
    correios = new Correios(); //cria um novo objeto correios

//executa o método de pesquisa de valor do frete
correios.getPrice(args);

//qunado o evento result for emitido faz um log do retorno da api
correios.on('result', function (result) {
  console.log(result);
});

//se ocorreu algum erro na execução faz um log do erro
correios.on('error', function (err) {
  console.log(err);
});
```


##Documentação

No exemplo anterior a variável **correios** é um objeto *[EventEmiter](http://nodejs.org/api/events.html)*. Você pode "escutar" pelos seguintes eventos:

####Métodos
O método implementado é o getPrice

#####correios.getPrice(args);

Para executar o comando tem que enviar os campos **obrigatórios**. Para mais detalhes e informações veja o [PDF da API dos correios](http://www.correios.com.br/webServices/PDF/SCPP_manual_implementacao_calculo_remoto_de_precos_e_prazos.pdf)

#######Obrigatórios
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

######Não obrigatórios
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



###Resultado

- ```result``` - Array com o resultado da pesquisa
#####Exemplo de resultado
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
#####Exemplo de erro
	```
Envie todos os campos obrigatórios
```

##Autor

| [![twitter/vitorleal](http://gravatar.com/avatar/e133221d7fbc0dee159dca127d2f6f00?s=80)](http://twitter.com/vitorleal "Follow @vitorleal on Twitter") |
|---|
| [Vitor Leal](http://vitorleal.com) |

##Licença

Veja [LICENSE.txt](https://github.com/vitorleal/correios/blob/master/LICENSE.txt)
