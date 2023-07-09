export default class Rand {
	static a = Math.floor(Math.random() * 100000);
	static b = Math.floor(Math.random() * 100000);
	static c = Math.floor(Math.random() * 100000);
	static d = Math.floor(Math.random() * 100000);
	static random() {
		var t = Rand.b << 9, r = Rand.b * 5; r = (r << 7 | r >>> 25) * 9;
		Rand.c ^= Rand.a; Rand.d ^= Rand.b;
		Rand.b ^= Rand.c; Rand.a ^= Rand.d; Rand.c ^= t;
		Rand.d = Rand.d << 11 | Rand.d >>> 21;
		return (r >>> 0) / 4294967296;
	}

	static seed(a, b, c ,d) {
		Rand.a = a;
		Rand.b = b;
		Rand.c = c;
		Rand.d = d;
	}
}
