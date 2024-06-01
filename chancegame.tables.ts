import { Name, Table } from "proton-tsc";

@table("bets")
export class Bet extends Table {
    constructor(
        public account: Name = new Name(),
        public bet_amount: u64 = 0,
        public reward_amount: u64 = 0
    ) {
        super();
    }

    @primary
    get primary(): u64 {
        return this.account.N;
    }
}
