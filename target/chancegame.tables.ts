import * as _chain from "as-chain";
import { Name, Table } from "proton-tsc";



export class BetDB extends _chain.MultiIndex<Bet> {

}

@table("bets", nocodegen)

export class Bet implements _chain.MultiIndexValue {
    
    constructor(
        public account: Name = new Name(),
        public bet_amount: u64 = 0,
        public reward_amount: u64 = 0
    ) {
        
    }

    @primary
    get primary(): u64 {
        return this.account.N;
    }

    pack(): u8[] {
        let enc = new _chain.Encoder(this.getSize());
        enc.pack(this.account);
        enc.packNumber<u64>(this.bet_amount);
        enc.packNumber<u64>(this.reward_amount);
        return enc.getBytes();
    }
    
    unpack(data: u8[]): usize {
        let dec = new _chain.Decoder(data);
        
        {
            let obj = new Name();
            dec.unpack(obj);
            this.account = obj;
        }
        this.bet_amount = dec.unpackNumber<u64>();
        this.reward_amount = dec.unpackNumber<u64>();
        return dec.getPos();
    }

    getSize(): usize {
        let size: usize = 0;
        size += this.account.getSize();
        size += sizeof<u64>();
        size += sizeof<u64>();
        return size;
    }

    static get tableName(): _chain.Name {
        return _chain.Name.fromU64(0x3AB3800000000000);
    }

    static tableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        const idxTableBase: u64 = this.tableName.N & 0xfffffffffffffff0;
        const indices: _chain.IDXDB[] = [
        ];
        return indices;
    }

    getTableName(): _chain.Name {
        return Bet.tableName;
    }

    getTableIndexes(code: _chain.Name, scope: _chain.Name): _chain.IDXDB[] {
        return Bet.tableIndexes(code, scope);
    }

    getPrimaryValue(): u64 {
        return this.primary
    }

    getSecondaryValue(i: i32): _chain.SecondaryValue {
        _chain.check(false, "no secondary value!");
        return new _chain.SecondaryValue(_chain.SecondaryType.U64, new Array<u64>(0));
    }
    
    setSecondaryValue(i: i32, value: _chain.SecondaryValue): void {
        _chain.check(false, "no secondary value!");
    }


    static new(code: _chain.Name, scope: _chain.Name  = _chain.EMPTY_NAME): BetDB {
        return new BetDB(code, scope, this.tableName, this.tableIndexes(code, scope));
    }
}
