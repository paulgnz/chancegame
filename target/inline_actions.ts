import * as _chain from "as-chain";
import { Name, Asset, ActionData, InlineAction, PermissionLevel } from "proton-tsc";


@packer(nocodegen)
export class TokenTransfer implements _chain.Packer {
    
    constructor(
        public from: Name = new Name(),
        public to: Name = new Name(),
        public quantity: Asset = new Asset(),
        public memo: string = ""
    ) {
        
    }
    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.from);
        enc.pack(this.to);
        enc.pack(this.quantity);
        enc.packString(this.memo);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.from = obj;
        }
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.to = obj;
        }
        
        {
            let obj = new Asset();
            dec.unpack(obj);
            this.quantity = obj;
        }
        this.memo = dec.unpackString();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.from.getSize();
        size += this.to.getSize();
        size += this.quantity.getSize();
        size += _chain.Utils.calcPackedStringLength(this.memo);
        return size;
    }
}

export function sendTransferTokens(from: Name, to: Name, quantity: Asset, memo: string): void {
    const tokenContract = Name.fromU64(0x5530EA033482A600); // Change this to the appropriate token contract
    const transfer = new InlineAction<TokenTransfer>("transfer");
    const action = transfer.act(tokenContract, new PermissionLevel(from, Name.fromU64(0x3232EDA800000000)));
    const actionParams = new TokenTransfer(from, to, quantity, memo);
    action.send(actionParams);
}
