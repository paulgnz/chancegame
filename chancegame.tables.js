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
exports.Bet = void 0;
const proton_tsc_1 = require("proton-tsc");
let Bet = class Bet extends proton_tsc_1.Table {
    account;
    bet_amount;
    reward_amount;
    constructor(account = new proton_tsc_1.Name(), bet_amount = 0, reward_amount = 0) {
        super();
        this.account = account;
        this.bet_amount = bet_amount;
        this.reward_amount = reward_amount;
    }
    get primary() {
        return this.account.N;
    }
};
__decorate([
    primary,
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Bet.prototype, "primary", null);
Bet = __decorate([
    table("bets"),
    __metadata("design:paramtypes", [proton_tsc_1.Name, Number, Number])
], Bet);
exports.Bet = Bet;
