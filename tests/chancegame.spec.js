"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const vert_1 = require("@proton/vert");
const blockchain = new vert_1.Blockchain();
const [useraccount, chancegameAccount] = blockchain.createAccounts('useraccount', 'chancegame');
const eosioToken = blockchain.createContract('eosio.token', 'contracts/eosio.token', true);
const chancegame = blockchain.createContract(chancegameAccount.name, 'target/chancegame.contract', true);
beforeEach(async () => {
    blockchain.resetTables();
    // Mint tokens and allocate to the account
    await (0, vert_1.mintTokens)(eosioToken, 'XPR', 4, 1000000000, 100000000, [useraccount.name]);
    // Ensure the blockchain state is properly initialized
    await new Promise(resolve => setTimeout(resolve, 5));
});
describe('Chance Game Contract Tests', () => {
    it('should place a bet and transfer rewards correctly', async () => {
        // Simulate a bet
        await chancegame.actions.bet([useraccount.name, 10000]).send(`${useraccount.name}@active`); // 10000 represents 1 XPR
        // Verify the bet and reward
        const data = chancegame.tables.bets().getTableRows();
        console.log('------ BETS ------');
        console.log(JSON.stringify(data));
        console.log('------------------');
        // Add further assertions as needed
        (0, chai_1.expect)(data).to.be.an('array').that.is.not.empty;
    });
    it('should throw an error for invalid bets', async () => {
        await (0, vert_1.expectToThrow)(chancegame.actions.bet([useraccount.name, 0]).send(`${useraccount.name}@active`), (0, vert_1.protonAssert)('Must bet a positive amount'));
    });
});
