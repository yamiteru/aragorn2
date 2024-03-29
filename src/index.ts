const SALT_SIZE = 32;

export const concat = (firstArray: Uint8Array, secondArray: Uint8Array) => {
  const resultArray = new Uint8Array(
    firstArray.byteLength + secondArray.byteLength
  );

  resultArray.set(firstArray, 0);
  resultArray.set(secondArray, firstArray.byteLength);

  return resultArray;
};

export const equal = (a: Uint8Array, b: Uint8Array) => {
  const l = a.length;

  if (l !== b.length) return false;

  for (let i = 0; i < l; ++i) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

export const stringToUint8Array = (value: string) => {
  const length = value.length;
  const array = new Uint8Array(length);

  for (let i = 0; i < length; ++i) {
    array.set([value.charCodeAt(i)], i);
  }

  return array;
};

export const Uint8ArrayToString = (value: Uint8Array) => {
  const length = value.byteLength;
  let string = "";

  for (let i = 0; i < length; ++i) {
    string += String.fromCharCode(value[i]);
  }

  return string;
};

export const hashRaw = async (
  password: string,
  salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE))
) => {
  return concat(
    salt,
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-512",
        concat(salt, stringToUint8Array(password))
      )
    )
  );
};

export const hash = async (
  password: string,
  salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE))
) => {
  return Uint8ArrayToString(
    concat(
      salt,
      new Uint8Array(
        await crypto.subtle.digest(
          "SHA-512",
          concat(salt, stringToUint8Array(password))
        )
      )
    )
  );
};

export const verifyRaw = async (
  hashedPassword: Uint8Array,
  unhashedPassword: string
) => {
  return equal(
    await hashRaw(unhashedPassword, hashedPassword.subarray(0, SALT_SIZE)),
    hashedPassword
  );
};

export const verify = async (
  hashedPassword: string,
  unhashedPassword: string
) => {
  const password = stringToUint8Array(hashedPassword);

  return equal(
    stringToUint8Array(
      await hash(unhashedPassword, password.subarray(0, SALT_SIZE))
    ),
    password
  );
};
