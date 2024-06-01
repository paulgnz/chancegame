import * as _chain from "as-chain";
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


class betAction implements _chain.Packer {
    constructor (
        public account: _chain.Name | null = null,
        public bet_amount: u64 = 0,
    ) {
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account!);
        enc.packNumber<u64>(this.bet_amount);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new _chain.Name();
            dec.unpack(obj);
            this.account! = obj;
        }
        this.bet_amount = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account!.getSize();
        size += sizeof<u64>();
        return size;
    }
}

export function apply(receiver: u64, firstReceiver: u64, action: u64): void {
	const _receiver = new _chain.Name(receiver);
	const _firstReceiver = new _chain.Name(firstReceiver);
	const _action = new _chain.Name(action);

	const mycontract = new chancegame(_receiver, _firstReceiver, _action);
	const actionData = _chain.readActionData();

	if (receiver == firstReceiver) {
		if (action == 0x3AB2000000000000) {//bet
            const args = new betAction();
            args.unpack(actionData);
            mycontract.bet(args.account!,args.bet_amount);
        }
	}
  
	if (receiver != firstReceiver) {
		
	}
	return;
}
