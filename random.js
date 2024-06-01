"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.random = void 0;
let seed = 123456789;
function random() {
    seed = (1103515245 * seed + 12345) % 2147483648;
    return seed;
}
exports.random = random;
