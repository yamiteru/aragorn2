const encoder = new TextEncoder();
const SALT_SIZE = 32;

const concat = (
	firstArray: Uint8Array,
	secondArray: Uint8Array
) => {
	const resultArray = new Uint8Array(
		firstArray.byteLength + secondArray.byteLength
	);
	
	resultArray.set(firstArray, 0);
	resultArray.set(secondArray, firstArray.byteLength);

	return resultArray;
};

const equal = (a: Uint8Array, b: Uint8Array) => {
	const l = a.length;

	if (l !== b.length) return false;

	for (let i = 0; i < l; ++i) {
		if (a[i] !== b[i]) return false;
	}

	return true;
}

export const hash = async (
	password: string,
	salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE))
) => new Uint8Array(
	concat(
		salt,
		new Uint8Array(
			await crypto.subtle.digest(
				"SHA-512",
				concat(salt, encoder.encode(password))
			)
		)
	)
);

export const verify = async (
	hashedPassword: Uint8Array,
	unhashedPassword: string
) => equal(
	await hash(
		unhashedPassword,
		new Uint8Array(hashedPassword).subarray(0, SALT_SIZE)
	),
	hashedPassword
);