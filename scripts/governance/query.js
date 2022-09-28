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
    let cosm1 = await Cosm.init(malagaOptions, MNEMONIC1);
    let cosm2 = await Cosm.init(malagaOptions, MNEMONIC2);

    let governanceContractAddress = GOVERNANCE;

    let queryTokenMsg = {
        get_token:{}
    }
    let querySTokenMsg = {
        get_s_token:{}
    }

    console.log(await cosm2.query(governanceContractAddress, queryTokenMsg));
    console.log(await cosm2.query(governanceContractAddress, querySTokenMsg));
}

main();
