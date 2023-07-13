export default class Rand {
	static #seed =  null;
	static #a; static #b; static #c; static #d;
	static random() {
		if (!Rand.#seed) {
			return Math.random();
		}
		var t = Rand.#b << 9, r = Rand.#b * 5; r = (r << 7 | r >>> 25) * 9;
		Rand.#c ^= Rand.#a; Rand.#d ^= Rand.#b;
		Rand.#b ^= Rand.#c; Rand.#a ^= Rand.#d; Rand.#c ^= t;
		Rand.#d = Rand.#d << 11 | Rand.#d >>> 21;
		return (r >>> 0) / 4294967296;
	}

	static seed(seed) {
		Rand.#seed = Math.floor(seed);
		Rand.#a = seed + 0x3a21;
		Rand.#b = Rand.#a + 0x338f3;
		Rand.#c = Rand.#b + 0x61205a;
		Rand.#d = Rand.#c + 0x135;
	}
}
