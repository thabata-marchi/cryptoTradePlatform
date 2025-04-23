# Plataforma de Trading

O objetivo deste projeto é desenvolver uma plataforma de trading voltada para a compra e venda de ativos digitais, utilizando criptomoedas como exemplo.

As negociações ocorrem por meio de contas de usuário, cada uma identificada por nome, e-mail, documento e senha. Esse processo de identificação é conhecido como KYC (Know Your Customer).

Cada conta pode possuir diferentes ativos, representados por seus respectivos códigos e quantidades. Para começar a operar, o usuário precisa realizar um depósito. Saques também são permitidos, possibilitando a retirada de fundos da plataforma.

As negociações são feitas dentro de um mercado, por meio de ordens de compra e venda, cada uma contendo a quantidade e o preço limite que o usuário está disposto a pagar ou receber pelo ativo.

As ordens são inseridas em um livro de ofertas e são executadas quando ocorre uma correspondência entre uma ordem de compra e uma de venda. A correspondência acontece sempre entre a maior oferta de compra e a menor oferta de venda. Por exemplo: se há uma ordem de compra de 1 BTC a R$ 83.000 e uma ordem de venda a R$ 82.400, ocorre uma negociação, pois o valor de compra é superior ao de venda.

Esse processo gera uma negociação, que registra a quantidade executada (sempre a menor entre as duas ordens), o valor acordado e o lado da ordem mais antiga.

Caso não haja correspondência imediata, a ordem permanece no livro aguardando novas contrapartes.

A plataforma também deverá fornecer informações como a profundidade do mercado, que exibe as ordens de compra e venda ativas, além do histórico de ordens e negociações realizadas por cada conta.

### Termos de Negócio

* ordem: order
* lado da ordem: side
* compra: buy ou bid
* venda: sell ou ask
* livro de ofertas: order book
* negociação: trade
* profundidade do mercado: depth
* mercado: market
* correspondência entre ordens: match
* conta: account
* realizar ordem: place order
* criar conta: signup


### Use Cases

#### Signup (Criar Conta)

**Input**: name, email, document, password<br/>
**Output**: accountId

Regras:

* O nome deve ser composto por nome e sobrenome
* O email deve ser válido e não deve ser duplicado
* O documento deve seguir as regras de validação do CPF
* A senha deve ter no mínimo 8 caracteres com letras minúsculas, maiúsculas e números

#### Deposit (Depósito)

**Input**: accountId, assetId, quantity<br/>
**Output**: void

Regras:

* A conta deve existir
* O assetId permitido é BTC ou USD
* A quantidade deve ser maior que zero

#### Withdraw (Saque)

**Input**: accountId, assetId, quantity<br/>
**Output**: void

Regras:

* A conta deve existir
* O assetId permitido é BTC ou USD
* A quantidade deve ser maior ou igual ao saldo

#### GetAccount (Obter Conta)

**Input**: accountId<br/>
**Output**: accountId, name, email, document, assets[] (assetId, quantity)

#### PlaceOrder (Criar Ordem)

**Input**: marketId, accountId, side, quantity, price<br/>
**Output**: orderId

Regras:

* Verificar se o mercado existe (vamos utilizar sempre BTC/USD nos exemplos)
* Verificar se a conta existe
* Verificar se a conta tem saldo suficiente para comprar ou vender a quantidade de ativo da ordem
* Bloquear a quantidade do ativo na conta até que a ordem seja executada ou cancelada
* Salvar a ordem no mecanismo de persistência
* Executar a ordem

#### ExecuteOrder (Executar Ordem)

Regras:

* A ordem de compra com maior preço e a ordem de venda com menor preço são comparadas, caso o preço da ordem de compra seja maior que o preço da ordem de venda, ela é executada, caso contrário ela permanece no livro de ofertas
* A execução pode ser total ou parcial, conforme ela acontece, a quantidade executada é indicada na ordem até que seja totalmente liquidada
* O preço executado é sempre da ordem mais antiga
* Caso a ordem seja totalmente executada ela é removida do livro de ofertas
* Salvar a ordem atualizada no banco de dados
* Se a ordem for executada uma negociação deve ser criada e persistida

#### GetDepth (Obter Profundidade)

**Input**: marketId, precision<br/>
**Output**: buys, sells

Regras:

* Agrupe as ordens por preço, somando as quantidade (exemplo: se existem duas ordens vendendo 10 unidades de BTC por 84500, retorne 20 unidade de BTC por 84500)
* Permita receber a precisão, ou seja, um fator de divisão para agrupar desconsiderando uma determinada quantidade de casas decimais (exemplo: existem 3 ordens comprando 4 unidades de BTC por 84500, 85600 e 84700, se forem consideradas 3 casas decimais, a exibição deve ser 12 unidades por 84000, agrupando tudo que estiver entre 84000 e 84999)

#### GetOrders (Obter Ordens)

**Input**: accountId, status<br/>
**Output**: orderId, side, quantity, price, fillQuantity, fillPrice, timestamp, status

#### GetTrades (Obter Negociações)

**Input**: marketId<br/>
**Output**: tradeId, buyOrderId, sellOrderId, side, quantity, price, timestamp

#### GetMarketInfo (Obter Informações do Mercado)

**Input**: marketId, startDate, endDate<br/>
**Output** spread, min, max, volume

Regras:

* O spread é a diferença entre a ordem de compra com preço mais alto e a ordem de venda com preço mais baixo
* O min é o menor preço negociado
* O max é o maior preço negociado
* O volume é o total da multiplicação da quantidade e do preço negociado

### API

Segue abaixo os endpoints da API:

* POST /signup
* POST /deposit
* POST /withdraw
* POST /place_order
* POST /cancel_order
* GET /accounts/:accountId
* GET /accounts/:accountId/orders
* GET /orders/:orderId
* GET /markets/:marketId/info
* GET /markets/:marketId/trades
* GET /markets/:marketId/depth

### Modelo de Dados

Segue abaixo o modelo de dados relacional do projeto:

<pre>

create schema ccca;

create table ccca.account (
	account_id uuid,
	name text,
	email text,
	document text,
	password text,
	primary key (account_id)
);

create table ccca.account_asset (
	account_id uuid,
	asset_id text,
	quantity numeric,
	primary key (account_id, asset_id)
);

create table ccca.order (
	order_id uuid,
	market_id text,
	account_id uuid,
	side text,
	quantity numeric,
	price numeric,
	fill_quantity numeric,
	fill_price numeric,
	status text,
	timestamp timestamptz,
	primary key (order_id)
);

create table ccca.trade (
	trade_id uuid,
	market_id text,
	buy_order_id uuid,
	sell_order_id uuid,
	side text,
	quantity numeric,
	price numeric,
	timestamp timestamptz,
	primary key (trade_id)
);
</pre>

### WebSocket

A plataforma terá um streaming de ordens, negociações e profundidade do mercado conforme novas ordens e negociações acontecem.
