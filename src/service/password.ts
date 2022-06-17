import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export default class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex");
    const hash = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${hash.toString("hex")}.${salt}`;
  }

  static async compare(password: string, systemHash: string) {
    const [hash, salt] = systemHash.split(".");
    let passwordHash = (await scryptAsync(password, salt, 64)) as Buffer;
    return hash === passwordHash.toString("hex");
  }
}
