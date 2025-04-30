import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import { validatePassword } from "./validatePassword";
import { getAccountAsset, getAccountAssets, getAccountById, getOrderById, saveAccount, saveAccountAsset, saveOrder, updateAccountAsset } from "./resources";

export async function deposit (input: any) {
    await saveAccountAsset(input);
}

export async function withdraw (input: any) {
    const accountAssetsData = await getAccountAsset(input.accountId, input.assetId);
    const currentQuantity = parseFloat(accountAssetsData.quantity)
    if (!accountAssetsData || currentQuantity < input.quantity) throw new Error("Insufficient funds");
    let quantity = currentQuantity - input.quantity;
    await updateAccountAsset(quantity, input.accountId, input.assetId);
}

export async function placeOrder (input: any) {
    const order = {
        orderId: crypto.randomUUID(),
        marketId: input.marketId,
        accountId: input.accountId,
        side: input.side,
        quantity: input.quantity,
        price: input.price,
        status: "open",
        timestamp: new Date()
    }
    await saveOrder(order);
    return {
        orderId: order.orderId
    }
}

export async function getOrder (orderId: string) {
    const orderData = await getOrderById(orderId);
    const order = {
        orderId: orderData.order_id,
        marketId: orderData.market_id,
        accountId: orderData.account_id,
        side: orderData.side,
        quantity: parseFloat(orderData.quantity),
        price: parseFloat(orderData.price),
        status: orderData.status,
        timestamp: orderData.timestamp
    }
    return order;
}

export async function getAccount (accountId: string) {
    const accountData = await getAccountById(accountId);
    const accountAssetsData = await getAccountAssets(accountId);
    accountData.assets = [];
    for (const accountAssetData of accountAssetsData) {
        accountData.assets.push({ assetId: accountAssetData.asset_id, quantity: parseFloat(accountAssetData.quantity) });
    }
    return accountData;
}
