import { Name, Asset, Symbol } from "proton-tsc";

export async function mintTokens(tokenContract: any, sym: string, precision: u8, maxSupply: number, initialSupply: number, recipients: Name[]): Promise<void> {
    const symbol = new Symbol(sym, precision);
    const maxSupplyAsset = new Asset(maxSupply * 10 ** precision, symbol);
    const initialSupplyAsset = new Asset(initialSupply * 10 ** precision, symbol);

    // Create the token with max supply
    await tokenContract.actions.create([Name.fromString('eosio'), maxSupplyAsset]).send('eosio@active');

    // Issue the initial supply to the eosio account
    await tokenContract.actions.issue([Name.fromString('eosio'), initialSupplyAsset, 'initial supply']).send('eosio@active');

    // Transfer the initial supply to the recipients
    for (const recipient of recipients) {
        await tokenContract.actions.transfer([Name.fromString('eosio'), recipient, initialSupplyAsset, 'initial transfer']).send('eosio@active');
    }
}
