import { Name, Asset, ActionData, InlineAction, PermissionLevel } from "proton-tsc";

@packer
export class TokenTransfer extends ActionData {
    constructor(
        public from: Name = new Name(),
        public to: Name = new Name(),
        public quantity: Asset = new Asset(),
        public memo: string = ""
    ) {
        super();
    }
}

export function sendTransferTokens(from: Name, to: Name, quantity: Asset, memo: string): void {
    const tokenContract = Name.fromString("eosio.token"); // Change this to the appropriate token contract
    const transfer = new InlineAction<TokenTransfer>("transfer");
    const action = transfer.act(tokenContract, new PermissionLevel(from, Name.fromString("active")));
    const actionParams = new TokenTransfer(from, to, quantity, memo);
    action.send(actionParams);
}
