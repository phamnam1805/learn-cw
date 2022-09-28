const { Cosm, malagaOptions } = require("../typescript/cosm.ts");
const { calculateFee, StdFee } = require("@cosmjs/stargate");
import {
    InstantiateOptions
} from "@cosmjs/cosmwasm-stargate";
const fs = require("fs");
const { coin } = require("@cosmjs/amino");

require("dotenv").config();

const MNEMONIC1 = process.env.MNEMONIC1;
const MNEMONIC2 = process.env.MNEMONIC2;
const MNEMONIC3 = process.env.MNEMONIC3;
const ARTIFACTS = __dirname + "/../../artifacts";
// import * as Base from "./typescript/base.ts"

async function main() {
    let cosm = await Cosm.init(malagaOptions, MNEMONIC1);
    let sToken = fs.readFileSync(ARTIFACTS + "/s_token.wasm");
    console.log(cosm.address);
    console.log(await cosm.upload(sToken));
}

main();
