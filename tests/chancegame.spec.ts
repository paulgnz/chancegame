import { expect } from "chai";
import { Blockchain, expectToThrow, mintTokens, protonAssert } from "@proton/vert";
import { Name, Asset } from "proton-tsc";
import { sendTransferTokens } from "../inline_actions";
import { random } from "../random";

const blockchain = new Blockchain();
const [chancegame, useraccount] = blockchain.createAccounts('chancegame', 'useraccount');
const tokenContract = blockchain.createContract('eosio.token', 'node_modules/proton-tsc/external/xtokens/xtokens');
const contract = blockchain.createContract('chancegame', 'target/chancegame.contract');

beforeEach(async () => {
    blockchain.resetTables();

    // Mint some tokens for testing
    await mintTokens(tokenContract, 'XPR', 4, 100000000, 10000000, [chancegame, useraccount]); // Adjusting for XPR
});

describe('Chance Game Contract Tests', () => {
    it('should place a bet and transfer rewards correctly', async () => {
        // Simulate a bet
        await contract.actions.bet(['useraccount', 10000]).send('useraccount@active'); // 10000 represents 1 XPR

        // Verify the bet and reward
        const data = contract.tables.bets().getTableRows();
        console.log('------ BETS ------');
        console.log(JSON.stringify(data));
        console.log('------------------');

        // Add further assertions as needed
        expect(data).to.be.an('array').that.is.not.empty;
    });

    it('should throw an error for invalid bets', async () => {
        await expectToThrow(
            contract.actions.bet(['useraccount', 0]).send('useraccount@active'),
            protonAssert('Must bet a positive amount')
        );
    });
});
