import axios from "axios";
import fs from "fs";
import {
    SigningCosmWasmClient,
    UploadResult,
    InstantiateResult,
    ExecuteResult,
    JsonObject,
    InstantiateOptions,
} from "@cosmjs/cosmwasm-stargate";
import { GasPrice, calculateFee, StdFee, Coin } from "@cosmjs/stargate";
import {
    DirectSecp256k1HdWallet,
    makeCosmoshubPath,
} from "@cosmjs/proto-signing";
import { HdPath } from "@cosmjs/crypto";
import path from "path";
import { coin } from "@cosmjs/amino";

export interface Options {
    readonly httpUrl: string;
    readonly networkId: string;
    readonly feeToken: string;
    readonly bech32prefix: string;
    readonly hdPath: HdPath;
    readonly faucetUrl?: string;
    readonly defaultKeyFile: string;
    readonly fees: {
        upload: number;
        init: number;
        exec: number;
    };
    readonly gasPrice: GasPrice;
}

export const malagaOptions: Options = {
    httpUrl: "https://rpc.malaga-420.cosmwasm.com",
    networkId: "malaga-420",
    bech32prefix: "wasm",
    feeToken: "umlg",
    faucetUrl: "https://faucet.malaga-420.cosmwasm.com/credit",
    hdPath: makeCosmoshubPath(0),
    defaultKeyFile: path.join(__dirname, ".malaga.key"),
    fees: {
        upload: 2500000,
        init: 1000000,
        exec: 500000,
    },
    gasPrice: GasPrice.fromString("0.25umlg"),
};

export const uniOptions: Options = {
    httpUrl: "https://rpc.uni.juno.deuslabs.fi",
    networkId: "uni",
    bech32prefix: "juno",
    feeToken: "ujunox",
    faucetUrl: "https://faucet.uni.juno.deuslabs.fi/credit",
    hdPath: makeCosmoshubPath(0),
    defaultKeyFile: path.join(__dirname, ".uni.key"),
    fees: {
        upload: 6000000,
        init: 500000,
        exec: 200000,
    },
    gasPrice: GasPrice.fromString("0.025ujunox"),
};

export class Cosm {
    address: string;
    options: Options;
    client: SigningCosmWasmClient;

    constructor() {}

    static init = async (options: Options, mnemonic: string): Promise<Cosm> => {
        let instance = new Cosm();
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
            hdPaths: [options.hdPath],
            prefix: options.bech32prefix,
        });
        const client = await instance.connect(wallet, options);
        const [account] = await wallet.getAccounts();
        instance.options = options;
        instance.address = account.address;
        instance.client = client;
        return instance;
    };

    connect = async (
        wallet: DirectSecp256k1HdWallet,
        options: Options
    ): Promise<SigningCosmWasmClient> => {
        const clientOptions = {
            prefix: options.bech32prefix,
        };
        return await SigningCosmWasmClient.connectWithSigner(
            options.httpUrl,
            wallet,
            clientOptions
        );
    };

    hitFaucet = async (): Promise<void> => {
        let denom: string = this.options.feeToken;
        let address: string = this.address;
        let faucetUrl: string = this.options.faucetUrl || "";
        await axios.post(faucetUrl, { denom, address });
    };

    getBalance = async (): Promise<Coin> => {
        const tokens = await this.client.getBalance(
            this.address,
            this.options.feeToken
        );
        return tokens;
    };

    getUploadFee = (): StdFee => {
        return calculateFee(this.options.fees.upload, this.options.gasPrice);
    };

    getInitFee = (): StdFee => {
        return calculateFee(this.options.fees.init, this.options.gasPrice);
    };

    getExecFee = (): StdFee => {
        return calculateFee(this.options.fees.exec, this.options.gasPrice);
    };

    upload = async (wasm: Uint8Array): Promise<UploadResult> => {
        let uploadFee: StdFee = this.getUploadFee();
        return await this.client.upload(this.address, wasm, uploadFee);
    };

    deployContractFromWasm = async (
        wasm: Uint8Array,
        instantiateMsg: Record<string, unknown>,
        label: string,
        admin: string,
        gasLimit: number
    ): Promise<InstantiateResult> => {
        let uploadFee: StdFee = this.getUploadFee();
        let result: UploadResult = await this.client.upload(
            this.address,
            wasm,
            uploadFee
        );

        const codeId = result.codeId;
        let options: InstantiateOptions;
        if (admin != null) {
            options = {
                admin: admin,
            };
        } else {
            options = null;
        }

        const instantiateResponse = await this.client.instantiate(
            this.address,
            codeId,
            instantiateMsg,
            label,
            calculateFee(gasLimit, this.options.gasPrice),
            options
        );

        return instantiateResponse;
    };

    deployContractFromCodeId = async (
        codeId: number,
        instantiateMsg: Record<string, unknown>,
        label: string,
        admin: string,
        gasLimit: number
    ): Promise<InstantiateResult> => {
        let options: InstantiateOptions;
        if (admin != null) {
            options = {
                admin: admin,
            };
        } else {
            options = null;
        }

        const instantiateResponse = await this.client.instantiate(
            this.address,
            codeId,
            instantiateMsg,
            label,
            calculateFee(gasLimit, this.options.gasPrice),
            options
        );

        return instantiateResponse;
    };

    execute = async (
        contractAddress: string,
        executeMsg: Record<string, unknown>,
        memo: string,
        funds: readonly Coin[],
        gasLimit: number
    ): Promise<ExecuteResult> => {
        return await this.client.execute(
            this.address,
            contractAddress,
            executeMsg,
            calculateFee(gasLimit, this.options.gasPrice),
            memo,
            funds
        );
    };

    query = async (
        contractAddress: string,
        queryMsg: Record<string, unknown>
    ): Promise<JsonObject> => {
        return await this.client.queryContractSmart(contractAddress, queryMsg);
    };

    getContractsByCodeId = async (
        codeId: number
    ): Promise<readonly string[]> => {
        return await this.client.getContracts(codeId);
    };
}
