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
const GOVERNANCE = process.env.GOVERNANCE;
const TOKEN = process.env.TOKEN;
const STOKEN = process.env.STOKEN;
const ARTIFACTS = __dirname + "/../../artifacts";
// import * as Base from "./typescript/base.ts"

async function main() {
    let cosm = await Cosm.init(malagaOptions, MNEMONIC1);
    let governance = fs.readFileSync(ARTIFACTS + "/governance_contract.wasm");
    console.log(cosm.address);

    // Deploy contract
    let instaniateMsg = {
        token: TOKEN,
        code_id: 1288
    }

    console.log(await cosm.deployContractFromWasm(governance, instaniateMsg, "Ryuu deploys Governance contract", cosm.address, 3000000));
}

main();
