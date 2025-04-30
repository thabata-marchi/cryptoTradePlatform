import pgp from "pg-promise";

export async function saveAccount (account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
    await connection.$pool.end();
}

export async function saveAccountAsset (input: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)", [input.accountId, input.assetId, input.quantity]);
    await connection.$pool.end();
}

export async function getAccountAsset (accountId: string, assetId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountAssetsData] = await connection.query("select * from ccca.account_asset where account_id = $1 and asset_id = $2", [accountId, assetId]);
    await connection.$pool.end();
    return accountAssetsData;
}

export async function getAccountAssets (accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const accountAssetsData = await connection.query("select * from ccca.account_asset where account_id = $1", [accountId]);
    await connection.$pool.end();
    return accountAssetsData;
}

export async function updateAccountAsset (quantity: number, accountId: string, assetId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("update ccca.account_asset set quantity = $1 where account_id = $2 and asset_id = $3", [quantity, accountId, assetId]);
    await connection.$pool.end();
}

export async function saveOrder (order: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query("insert into ccca.order (order_id, market_id, account_id, side, quantity, price, status, timestamp) values ($1, $2, $3, $4, $5, $6, $7, $8)", [order.orderId, order.marketId, order.accountId, order.side, order.quantity, order.price, order.status, order.timestamp]);
    await connection.$pool.end();
}

export async function getOrderById (orderId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [orderData] = await connection.query("select * from ccca.order where order_id = $1", [orderId]);
    await connection.$pool.end();
    return orderData;
}

export async function getAccountById (accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query("select * from ccca.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return accountData;
}
