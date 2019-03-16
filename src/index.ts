import { randomBytes } from 'crypto';
import { promisify } from 'util';

const lowerABCPool = 'abcdefghijklmnopqrstuvwxyz';
const upperABCPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberPool = '1234567890';
const symbolPool = '!@#$%^&*-_=+';

let charPool = '';

const lowerABC = true;
const upperABC = true;
const number = true;
const symbol = true;
const passwordLength = 20;
const numOfPasswords = 1;

// preallocate array increases ops
// tslint:disable-next-line:prefer-array-literal
const passwordArray = new Array(numOfPasswords);

if (lowerABC) {
  charPool += lowerABCPool;
}
if (upperABC) {
  charPool += upperABCPool;
}
if (number) {
  charPool += numberPool;
}
if (symbol) {
  charPool += symbolPool;
}

if (charPool.length === 0) {
  console.log('You cannot generate a password without any conditions.');
  process.exit(1);
}

const randomBytesAsync = promisify(randomBytes);

const charGeneration = async (charPool: string) => {
  try {
    const buf = await randomBytesAsync(4); // generate 4 random bytes
    const number = buf.readUIntLE(0, 4); // casts into uint, little endian

    if (number > charPool.length - 1) { // out of bound
      return charPool[number % charPool.length]; // take the remainder out, get the char out
    }

    return charPool[number];

  } catch (err) {
    throw err;
  }
};

// janky async promises code below, var name is not what it says.

for (let j = 0; j < numOfPasswords; j += 1) { // for number of passwords

  // tslint:disable-next-line:prefer-array-literal
  const charArray = new Array(passwordLength);

  for (let i = 0; i < passwordLength; i += 1) {
    charArray[i] = charGeneration(charPool);
  }

  passwordArray[j] = Promise.all(charArray)
    .then((charArr) => { // charArr is array of characters in password
      return charArr.join(''); // password as string
    });

  // TODO: check if each password fits requirement...

}

Promise.all(passwordArray)
.then((passwords) => {
  console.log(passwords);
})
.catch((err) => {
  throw err;
});
