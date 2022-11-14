const encoder = new TextEncoder();
const SALT_SIZE = 32;

const concat = (firstArray: Uint8Array, secondArray: Uint8Array) => {
  const resultArray = new Uint8Array(
    firstArray.byteLength + secondArray.byteLength
  );

  resultArray.set(firstArray, 0);
  resultArray.set(secondArray, firstArray.byteLength);

  return resultArray;
};

export const createHasher = (options: {
  random: (array: Uint8Array) => Uint8Array;
  digest: (algorithm: "SHA-512", data: ArrayBuffer) => Promise<ArrayBuffer>;
  equal: (a: Uint8Array, b: Uint8Array) => boolean;
}) => {
  const { random, digest, equal } = options;

  const hash = async (
    password: string,
    salt = random(new Uint8Array(SALT_SIZE))
  ) =>
    new Uint8Array(
      concat(
        salt,
        new Uint8Array(
          await digest("SHA-512", concat(salt, encoder.encode(password)))
        )
      )
    );

  const verify = async (hashedPassword: Uint8Array, unhashedPassword: string) =>
    equal(
      await hash(
        unhashedPassword,
        new Uint8Array(hashedPassword).subarray(0, SALT_SIZE)
      ),
      hashedPassword
    );

  return {
    hash,
    verify,
  };
};
