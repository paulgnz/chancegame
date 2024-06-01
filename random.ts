let seed: u32 = 123456789;

export function random(): u32 {
    seed = (1103515245 * seed + 12345) % 2147483648;
    return seed;
}
