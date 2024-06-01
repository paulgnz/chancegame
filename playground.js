"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vert_1 = require("@proton/vert");
const proton_tsc_1 = require("proton-tsc");
const eosio_1 = require("@greymass/eosio");
// Helper function to wait for a specified duration
async function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}
// Mint tokens function
async function mintTokens(tokenContract, sym, precision, maxSupply, initialSupply, recipients) {
    const symbol = new proton_tsc_1.Symbol(sym, precision);
    const maxSupplyAsset = new proton_tsc_1.Asset(maxSupply * 10 ** precision, symbol);
    const initialSupplyAsset = new proton_tsc_1.Asset(initialSupply * 10 ** precision, symbol);
    // Create the token with max supply
    await tokenContract.actions.create([eosio_1.Name.from('eosio'), maxSupplyAsset.toString()]).send('eosio@active');
    // Issue the initial supply to the eosio account
    await tokenContract.actions.issue([eosio_1.Name.from('eosio'), initialSupplyAsset.toString(), 'initial supply']).send('eosio@active');
    // Transfer the initial supply to the recipients
    for (const recipient of recipients) {
        await tokenContract.actions.transfer([eosio_1.Name.from('eosio'), recipient.toString(), initialSupplyAsset.toString(), 'initial transfer']).send('eosio@active');
    }
}
async function main() {
    // Create a new blockchain instance
    const blockchain = new vert_1.Blockchain();
    // Create the necessary accounts
    const [useraccount1, useraccount2, useraccount3, chancegameAccount] = blockchain.createAccounts('useraccount1', 'useraccount2', 'useraccount3', 'chancegame');
    // Convert account names to `Name` objects from `@greymass/eosio`
    const recipients = [useraccount1, useraccount2, useraccount3].map(acc => eosio_1.Name.from(acc.name));
    // Deploy the token contracts
    const eosioToken = blockchain.createContract('eosio.token', 'contracts/eosio.token', true);
    // Deploy the chancegame contract
    const chancegame = blockchain.createContract(chancegameAccount.name, 'target/chancegame.contract', true);
    // Mint tokens and allocate to the accounts
    await mintTokens(eosioToken, 'XPR', 4, 1000000000, 100000000, recipients); // Pass an array of Name objects
    // Ensure the blockchain state is properly initialized
    await wait(5);
    // Test the bet action with one of the user accounts
    await chancegame.actions.bet([useraccount1.name, 10000]).send(`${useraccount1.name}@active`); // 10000 represents 1 XPR
    console.log('------ BETS ------');
    const data = chancegame.tables.bets().getTableRows();
    console.log(JSON.stringify(data));
    console.log('------------------');
}
main();
