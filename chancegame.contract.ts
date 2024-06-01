import { Contract, Name, Asset, Symbol, check, requireAuth, TableStore, print } from "proton-tsc";
import { Bet } from "./chancegame.tables";
import { sendTransferTokens } from "./inline_actions";
import { random } from "./random";

@contract
export class chancegame extends Contract {
    private betTable: TableStore<Bet> = new TableStore<Bet>(this.receiver, this.receiver);

    @action("bet")
    bet(
        account: Name,
        bet_amount: u64
    ): void {
        requireAuth(account);

        // Check the bet amount (e.g., at least 1 XPR in micro-units, which is 10000)
        check(bet_amount > 0, "Must bet a positive amount");

        // Convert bet_amount from u64 to Asset
        const bet_asset = new Asset(bet_amount, new Symbol("XPR", 4)); // Assuming XPR has 4 decimal places

        // Generate a random number using the custom random function
        const random_factor = random() % 10; // random number between 0 and 9

        // Determine the reward (e.g., 2x bet amount if random_factor is even)
        let reward_amount: u64;
        if (random_factor % 2 === 0) {
            reward_amount = bet_amount * 2;
        } else {
            reward_amount = bet_amount / 2;
        }

        // Convert reward_amount from u64 to Asset
        const reward_asset = new Asset(reward_amount, new Symbol("OTHER", 4)); // Assuming reward token has 4 decimal places

        // Store the bet and reward information
        const bet = new Bet(account, bet_amount, reward_amount);
        this.betTable.set(bet, account);

        // Log the result
        print(`Bet placed by ${account}: bet_amount=${bet_amount}, reward_amount=${reward_amount}`);

        // Transfer the reward using the custom inline action
        sendTransferTokens(account, account, reward_asset, "Your reward!");
    }
}
