const { Cosm, malagaOptions } = require("./typescript/cosm.ts");
const { calculateFee, StdFee } = require("@cosmjs/stargate");
const fs = require("fs");
const { coin } = require("@cosmjs/amino");

require("dotenv").config();

const MNEMONIC1 = process.env.MNEMONIC1;
const MNEMONIC2 = process.env.MNEMONIC2;
const MNEMONIC3 = process.env.MNEMONIC3;
const ARTIFACTS = __dirname + "/../artifacts";
// import * as Base from "./typescript/base.ts"

async function main() {
    let cosm1 = await Cosm.init(malagaOptions, MNEMONIC1);
    let cosm2 = await Cosm.init(malagaOptions, MNEMONIC2);
    let cosm3 = await Cosm.init(malagaOptions, MNEMONIC3);
    let simpleOption = fs.readFileSync(ARTIFACTS + "/simple_option.wasm");
    let nameservice = fs.readFileSync(ARTIFACTS + "/cw_nameservice.wasm");
    let simpleContract = fs.readFileSync(ARTIFACTS + "/simple_contract.wasm");  
    console.log(cosm1.address);
    console.log(cosm2.address);
    console.log(cosm3.address);

    // Deploy contract
    // let instaniateMsg = {
    //     age: 22,
    //     owner_name: "Ryuu"
    // }

    // console.log(await cosm.deployContractFromWasm(simpleContract, instaniateMsg, "Ryuu's first contract"));

    // Interact with contract 
    let contractAddress = "wasm1aku78gq0p3jz0vyc9td83mfglkz77stugdz828uck0z8mgs028sq580s7q";

    // let executeMsg = {
    //     add_user: {
    // data: {
    //     age: 22,
    //     name: "Raijin"
    // }
    //     }
    // }

    // console.log(await cosm.execute(contractAddress, executeMsg, "add user raijin", []));

    // Query
    // let queryMsg = {
    //     get_data: {
    //         user_name: "Raijin"
    //     }
    // }

    // console.log(await cosm.query(contractAddress, queryMsg));
    // queryMsg = {
    //     get_data: {
    //         user_name: "RaijinRyuu"
    //     }
    // }

    // console.log(await cosm.query(contractAddress, queryMsg));

    // // Update
    // let executeMsg = {
    //     update_user: {
    //         data: {
    //             age: 24,
    //             name: "Raijin"
    //         }
    //     }
    // }

    
    // console.log(await cosm.execute(contractAddress, executeMsg, "update user raijin", []));

    // queryMsg = {
    //     get_data: {
    //         user_name: "Raijin"
    //     }
    // }

    // console.log(await cosm.query(contractAddress, queryMsg));
}

main();
