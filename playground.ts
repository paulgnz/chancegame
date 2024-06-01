import { Blockchain } from "@proton/vert";
import { mintTokens } from "./src/mintTokens"; // Import the mintTokens function
import { Name } from "proton-tsc";

// Helper function to wait for a specified duration
async function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    // Create a new blockchain instance
    const blockchain = new Blockchain();

    // Deploy the token contracts
    const eosioToken = blockchain.createContract('eosio.token', 'contracts/eosio.token', true);

    // Deploy the chancegame contract
    const chancegame = blockchain.createContract('chancegame', 'target/chancegame.contract', true);

    // Create the necessary accounts
    const [useraccount] = blockchain.createAccounts('useraccount');

    // Convert the user account name to a Name type
    const userName = Name.fromString(useraccount.name);

    // Mint tokens and allocate to the account
    await mintTokens(eosioToken, 'XPR', 4, 1000000000, 100000000, [userName]);

    // Ensure the blockchain state is properly initialized
    await wait(5);

    // Test the bet action
    await chancegame.actions.bet([useraccount.name, 10000]).send(`${useraccount.name}@active`); // 10000 represents 1 XPR

    console.log('------ BETS ------');
    const data = chancegame.tables.bets().getTableRows();
    console.log(JSON.stringify(data));
    console.log('------------------');
}

main();
