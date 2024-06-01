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
exports.chancegame = void 0;
const proton_tsc_1 = require("proton-tsc");
const chancegame_tables_1 = require("./chancegame.tables");
const inline_actions_1 = require("./inline_actions");
const random_1 = require("./random");
let chancegame = class chancegame extends proton_tsc_1.Contract {
    betTable = new proton_tsc_1.TableStore(this.receiver, this.receiver);
    bet(account, bet_amount) {
        (0, proton_tsc_1.requireAuth)(account);
        // Check the bet amount (e.g., at least 1 XPR in micro-units, which is 10000)
        (0, proton_tsc_1.check)(bet_amount > 0, "Must bet a positive amount");
        // Convert bet_amount from u64 to Asset
        const bet_asset = new proton_tsc_1.Asset(bet_amount, new proton_tsc_1.Symbol("XPR", 4)); // Assuming XPR has 4 decimal places
        // Generate a random number using the custom random function
        const random_factor = (0, random_1.random)() % 10; // random number between 0 and 9
        // Determine the reward (e.g., 2x bet amount if random_factor is even)
        let reward_amount;
        if (random_factor % 2 === 0) {
            reward_amount = bet_amount * 2;
        }
        else {
            reward_amount = bet_amount / 2;
        }
        // Convert reward_amount from u64 to Asset
        const reward_asset = new proton_tsc_1.Asset(reward_amount, new proton_tsc_1.Symbol("OTHER", 4)); // Assuming reward token has 4 decimal places
        // Store the bet and reward information
        const bet = new chancegame_tables_1.Bet(account, bet_amount, reward_amount);
        this.betTable.set(bet, account);
        // Log the result
        (0, proton_tsc_1.print)(`Bet placed by ${account}: bet_amount=${bet_amount}, reward_amount=${reward_amount}`);
        // Transfer the reward using the custom inline action
        (0, inline_actions_1.sendTransferTokens)(account, account, reward_asset, "Your reward!");
    }
};
__decorate([
    action("bet"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [proton_tsc_1.Name, Number]),
    __metadata("design:returntype", void 0)
], chancegame.prototype, "bet", null);
chancegame = __decorate([
    contract
], chancegame);
exports.chancegame = chancegame;
