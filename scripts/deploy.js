const { Cosm, malagaOptions } = require("./typescript/cosm.ts");
const { calculateFee, StdFee } = require("@cosmjs/stargate");
const fs = require("fs");
const { coin } = require("@cosmjs/amino");

require("dotenv").config();

const MNEMONIC = process.env.MNEMONIC;
const ARTIFACTS = __dirname + "/../artifacts";
// import * as Base from "./typescript/base.ts"

async function main() {
    let cosm = await Cosm.init(malagaOptions, MNEMONIC);
    let simpleOption = fs.readFileSync(ARTIFACTS + "/simple_option.wasm");
    let nameservice = fs.readFileSync(ARTIFACTS + "/cw_nameservice.wasm");

    // Deploy contract
    // let instaniateMsg = {
    //     purchase_price: coin(100, "umlg"),
    //     transfer_price: coin(999, "umlg")
    // }

    // console.log(await base.deployContractFromWasm(nameservice, instaniateMsg, "Hello World"));

    // Interact with contract 
    let contractAddress = "wasm13rgevfdvvsk3va68xcunlg7fyk9ycadj2hpvapkcfu86y59fvp3s3gtlmj";
    let executeMsg = {
        register:{
            name: "Raijin"
        }
    }

    console.log(await cosm.execute(contractAddress, executeMsg, "How are you?", [coin(100, "umlg")]));
}

main();
