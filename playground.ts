import { Blockchain } from "@proton/vert";

async function wait(ms: number) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    const blockchain = new Blockchain();
    const contract = blockchain.createContract('chancegame', 'target/chancegame.contract');
    
    //HERE
    const account = blockchain.createAccounts("useraccount"); 
    //You need an account existing on the blockchain with the name you use in the contract.send('account@permission')
    
    await wait(0);

    // Test the bet action
    await contract.actions.bet(['useraccount', 10000]).send('useraccount@active'); // 10000 represents 1 XPR

    console.log('------ BETS ------');
    const data = contract.tables.bets().getTableRows();
    console.log(JSON.stringify(data));
    console.log('------------------');
}

main();
