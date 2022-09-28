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
    let cw20Base = fs.readFileSync(ARTIFACTS + "/cw20_base.wasm");
    let sToken = fs.readFileSync(ARTIFACTS + "/s_token.wasm");
    console.log(cosm.address);

    // Deploy contract
    let instaniateMsg = {
        name: "Raijin Ryuu",
        symbol: "Ryuu",
        decimals: 6,
        initial_balances: [
            {
                address: cosm.address,
                amount: "1609000000"
            }
        ],
        mint: {
            minter: cosm.address,
            cap: null
        },
        marketing: {
            project: "Ryuu's Project",
            description: "Ryuu's Token",
            marketing: null,
            logo: {
                url: "https://steamuserimages-a.akamaihd.net/ugc/1660106331075249843/7322A01C17927B77D1EA1CA65C67EED23EB19D36/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
            }
        },
        hook_msg: null
    }

    console.log(await cosm.deployContractFromWasm(sToken, instaniateMsg, "Ryuu deploys cw20 token", cosm.address, 300000));
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
