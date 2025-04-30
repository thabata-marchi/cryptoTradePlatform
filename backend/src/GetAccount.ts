import AccountDAO from "./AccountDAO";

export default class GetAccount {

    constructor (readonly accountDAO: AccountDAO) {
    }

    async execute (accountId: string): Promise<any> {
        const accountData = await this.accountDAO.getAccountById(accountId);
        const accountAssetsData = await this.accountDAO.getAccountAssets(accountId);
        accountData.assets = [];
        for (const accountAssetData of accountAssetsData) {
            accountData.assets.push({ assetId: accountAssetData.asset_id, quantity: parseFloat(accountAssetData.quantity) });
        }
        return accountData;
    }
}
