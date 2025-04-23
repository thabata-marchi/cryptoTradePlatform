# Plataforma de Trading 📈

O objetivo deste projeto é desenvolver uma plataforma de trading voltada para a compra e venda de ativos digitais, utilizando criptomoedas como exemplo.

As negociações ocorrem por meio de contas de usuário, cada uma identificada por nome, e-mail, documento e senha. Esse processo de identificação é conhecido como KYC (Know Your Customer).

Cada conta pode possuir diferentes ativos, representados por seus respectivos códigos e quantidades. Para começar a operar, o usuário precisa realizar um depósito. Saques também são permitidos, possibilitando a retirada de fundos da plataforma.

As negociações são feitas dentro de um mercado, por meio de ordens de compra e venda, cada uma contendo a quantidade e o preço limite que o usuário está disposto a pagar ou receber pelo ativo.

As ordens são inseridas em um livro de ofertas e são executadas quando ocorre uma correspondência entre uma ordem de compra e uma de venda. A correspondência acontece sempre entre a maior oferta de compra e a menor oferta de venda. Por exemplo: se há uma ordem de compra de 1 BTC a R$ 83.000 e uma ordem de venda a R$ 82.400, ocorre uma negociação, pois o valor de compra é superior ao de venda.

Esse processo gera uma negociação, que registra a quantidade executada (sempre a menor entre as duas ordens), o valor acordado e o lado da ordem mais antiga.

Caso não haja correspondência imediata, a ordem permanece no livro aguardando novas contrapartes.

A plataforma também deverá fornecer informações como a profundidade do mercado, que exibe as ordens de compra e venda ativas, além do histórico de ordens e negociações realizadas por cada conta.

### Linguagem Ubíqua

| Termo                           | Definição (linguagem do domínio) |
|--------------------------------|----------------------------------|
| Ativo (Asset)                  | Um item negociável, como BTC, ETH, ações, etc. |
| Compra (Buy ou Bid)            | Intenção de comprar um ativo a um determinado preço. |
| Depth        | Representa a profundidade do livro de ofertas: quantidade agregada de ordens de compra e venda por faixa de preço. Demonstra a liquidez e resistência a movimentos de preço. |
| Livro de Ofertas (Order Book)  | Lista de ordens de compra e venda abertas, organizadas por preço. |
| Market                         | Representa um par de negociação, com suas ordens, execuções (BTC/USD). |
| Execução ou Correspondência (Match)            | Ocorre quando duas ordens opostas (compra/venda) são compatíveis em preço e volume. |
| Negociação (Trade)            | Representa o resultado de uma execução entre uma ordem de compra e uma de venda. |
| Ordem (Order)                  | Instrução para comprar ou vender um ativo. Pode ser de diferentes tipos. |
| Ordem de Mercado (Market Order)| Ordem executada imediatamente ao melhor preço disponível. |
| Ordem Limitada (Limit Order)   | Ordem que só será executada se atingir o preço especificado (Vamos utilizar esse tipo de ordem no projeto). |
| Preço de Abertura (Open Price) | Preço da primeira negociação de um período. |
| Preço de Compra (Buy/Bid Price)    | O maior preço que alguém está disposto a pagar. |
| Preço de Fechamento (Close Price) | Preço da última negociação de um período. |
| Preço de Venda (Sell/Ask Price)     | O menor preço que alguém está disposto a vender. |
| Preço Máximo (Max Price)       | O maior preço registrado em um determinado período. |
| Preço Mínimo (Min Price)       | O menor preço registrado em um determinado período. |
| Side                           | Direção da ordem: buy (compra) ou sell (venda). Define se o usuário quer adquirir ou se desfazer de um ativo. |
| Spread                         | Diferença entre o preço de venda e o preço de compra existentes no livro de ofertas. Reflete a liquidez do mercado. |
| Último Preço (Last Price)      | Preço da negociação mais recente. |
| Venda (Sell ou Ask)            | Intenção de vender um ativo a um determinado preço. |
| Volume                         | Quantidade de ativo negociado em um determinado período ou em uma ordem específica. |

### Use Cases

***

#### Signup (Criar Conta)

<p>Criar uma conta para o usuário realizar negociações na plataforma.</p>

**Input**: name, email, document, password<br/>
**Output**: accountId

Regras:

* O nome deve ser composto por nome e sobrenome
* O email deve ser válido e não deve ser duplicado
* O documento deve seguir as regras de validação do CPF
* A senha deve ter no mínimo 8 caracteres com letras minúsculas, maiúsculas e números

***

#### Deposit (Depósito)

<p>Adicionar fundos em uma conta.</p>

**Input**: accountId, assetId, quantity<br/>
**Output**: void

Regras:

* A conta deve existir
* O assetId permitido é BTC ou USD
* A quantidade deve ser maior que zero

***

#### Withdraw (Saque)

<p>Retirar fundos de uma conta.</p>

**Input**: accountId, assetId, quantity<br/>
**Output**: void

Regras:

* A conta deve existir
* O assetId permitido é BTC ou USD
* A quantidade deve ser maior ou igual ao saldo

***

#### GetAccount (Obter Conta)

<p>Retornar informações de uma conta.</p>

**Input**: accountId<br/>
**Output**: accountId, name, email, document, assets[] (assetId, quantity)

Regras:
* A conta deve existir

***

#### PlaceOrder (Criar Ordem)

<p>Criar uma ordem de compra ou venda. Neste projeto vamos utilizar o conceito de ordem limitada, ou seja, que só é executada se a quantidade e o preço forem atingidos.</p>

**Input**: marketId, accountId, side, quantity, price<br/>
**Output**: orderId

Regras:

* Verificar se a conta existe
* Verificar se a conta tem saldo suficiente para comprar ou vender a quantidade de ativos no preço definido na ordem
* Salvar a ordem no mecanismo de persistência

Observações:
* O marketId é composto de um par de ativos (exemplo: BTC/USD). O lado esquerdo é o ativo principal, que está sendo comprado ou vendido, e o lado direito é o ativo utilizado para pagamento. Ou seja, se a ordem for de venda, a conta deve ter saldo no ativo principal, que está sendo negociado, nesse caso BTC. Se a ordem for de compra, a conta deve ter saldo no ativo que está sendo utilizado para o pagamento, nesse caso USD
* A verificação do saldo deve levar em consideração as ordens que estão em aberto, evitando que alguém compra ou venda um ativo duas vezes
* Sempre que uma nova ordem é criada, a plataforma deve tentar executá-la (***essa parte ainda não será implementada***)

***

#### ExecuteOrder (Executar Ordem)

<p>Quando uma nova ordem é inserida no livro de ofertas, o mecanismo de matching realiza uma tentativa de execução. Esse processo avalia se a ordem pode ser casada imediatamente com ordens do lado oposto.</p>

Regras:

* A ordem de compra com maior preço e a ordem de venda com menor preço são comparadas, caso o preço da ordem de compra seja maior que o preço da ordem de venda, ela é executada, caso contrário ela permanece no livro de ofertas
* A execução pode ser total ou parcial, conforme ela acontece, a quantidade executada é indicada na ordem até que seja totalmente liquidada
* O preço executado é sempre da ordem mais antiga
* Caso a ordem seja totalmente executada ela é removida do livro de ofertas
* Salvar a ordem atualizada no banco de dados
* Se a ordem for executada uma negociação deve ser criada e persistida

***

#### GetDepth (Obter Profundidade)

<p>Retorna a profundidade do mercado para um par de ativos (market), representando as ordens de compra e venda abertas, organizadas por faixa de preço. Essa informação é essencial para exibir o livro de ofertas agregado (depth chart) e analisar a liquidez disponível em cada lado.</p>

**Input**: marketId, precision<br/>
**Output**: buys, sells

Regras:

* Agrupe as ordens por preço, somando as quantidade (exemplo: se existem duas ordens vendendo 10 unidades de BTC por 84500, retorne 20 unidade de BTC por 84500)
* Permita receber a precisão, ou seja, um fator de divisão para agrupar desconsiderando uma determinada quantidade de casas decimais (exemplo: existem 3 ordens comprando 4 unidades de BTC por 84500, 85600 e 84700, se forem consideradas 3 casas decimais, a exibição deve ser 12 unidades por 84000, agrupando tudo que estiver entre 84000 e 84999)

***

#### GetOrders (Obter Ordens)

<p>Retorna as ordens de uma conta específica, podendo ter um filtro de status.</p>

**Input**: accountId, status<br/>
**Output**: orderId, side, quantity, price, fillQuantity, fillPrice, timestamp, status

***

#### GetTrades (Obter Negociações)

<p>Retorna as negociações.</p>

**Input**: marketId<br/>
**Output**: tradeId, buyOrderId, sellOrderId, side, quantity, price, timestamp

***

#### GetMarketInfo (Obter Informações do Mercado)

<p>Retorna as informações estatísticas do mercado.</p>

**Input**: marketId, startDate, endDate<br/>
**Output** spread, min, max, volume

Regras:

* O spread é a diferença entre a ordem de compra com preço mais alto e a ordem de venda com preço mais baixo
* O min é o menor preço negociado
* O max é o maior preço negociado
* O volume é o total da multiplicação da quantidade e do preço negociado

***

### API

***

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

***

### Modelo de Dados

***

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

***

### WebSocket

***

A plataforma terá um streaming de ordens, negociações e profundidade do mercado conforme novas ordens são criadas e executadas. Os retornos devem ser os mesmos dos use cases já definidos na especificação.

### Decisões de Arquitetura

#### ADR 001: Armazenar Order Book em Memória

##### Contexto
A plataforma de trading precisa de baixa latência no matching de ordens, alto throughput, e consistência forte entre ordens e negociações.

##### Decisão
Manteremos o order book em memória na engine de matching, desacoplado da persistência. Ordens e trades serão salvos em banco, mas a estrutura de book será volátil e reconstruída caso necessário por meio dos dados persistidos previamente.

##### Alternativas Consideradas
- **Usar banco de dados para o livro de ordens**: descartado por latência alta.
- **Manter em Redis**: possível, mas sem vantagens claras frente à memória local e adiciona complexidade de consistência.

##### Consequências
- Engine de matching não será stateless.
- Afeta a escalabilidade horizontal.
- Precisamos de um mecanismo de recuperação caso a aplicação seja reiniciada.
- Ganho significativo de performance e simplicidade no matching.
