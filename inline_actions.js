"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTransferTokens = exports.TokenTransfer = void 0;
const proton_tsc_1 = require("proton-tsc");
let TokenTransfer = class TokenTransfer extends proton_tsc_1.ActionData {
    from;
    to;
    quantity;
    memo;
    constructor(from = new proton_tsc_1.Name(), to = new proton_tsc_1.Name(), quantity = new proton_tsc_1.Asset(), memo = "") {
        super();
        this.from = from;
        this.to = to;
        this.quantity = quantity;
        this.memo = memo;
    }
};
TokenTransfer = __decorate([
    packer,
    __metadata("design:paramtypes", [proton_tsc_1.Name,
        proton_tsc_1.Name,
        proton_tsc_1.Asset, String])
], TokenTransfer);
exports.TokenTransfer = TokenTransfer;
function sendTransferTokens(from, to, quantity, memo) {
    const tokenContract = proton_tsc_1.Name.fromString("eosio.token"); // Change this to the appropriate token contract
    const transfer = new proton_tsc_1.InlineAction("transfer");
    const action = transfer.act(tokenContract, new proton_tsc_1.PermissionLevel(from, proton_tsc_1.Name.fromString("active")));
    const actionParams = new TokenTransfer(from, to, quantity, memo);
    action.send(actionParams);
}
exports.sendTransferTokens = sendTransferTokens;
