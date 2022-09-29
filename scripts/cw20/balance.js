const { Cosm, malagaOptions } = require("../typescript/cosm.ts");
const { calculateFee, StdFee } = require("@cosmjs/stargate");
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
    let tokenContractAddress = TOKEN;
    let sTokenContractAddress = STOKEN;

    // Mint token
    let queryMsg = {
        balance: {
            address: cosm2.address
        }
    }

    console.log("umlg: ", await cosm2.getBalance());
    console.log("token: ", await cosm2.query(tokenContractAddress, queryMsg));
    console.log("stoken: ", await cosm2.query(sTokenContractAddress, queryMsg));
    // {
    //     contractAddress: 'wasm14xjsd059c6e4zvszs29ars7tkqs97eaen6jc3vvhdl67mrtk6e5qr3jkx0',
    //     logs: [ { msg_index: 0, log: '', events: [Array] } ],
    //     height: 1822938,
    //     transactionHash: '2A38593DA168CB6C1B64FD88BC2A1C181AC763A2FA7AF41B75D722F798D96889',
    //     gasWanted: 300000,
    //     gasUsed: 207011
    // }
}

main();
