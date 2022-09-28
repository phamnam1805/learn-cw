use std::ops::Add;
use std::vec;

#[cfg(not(feature = "library"))]
use cosmwasm_std::{
    entry_point, to_binary, Addr, Binary, CanonicalAddr, Deps, DepsMut, Env, MessageInfo, Response,
    StdResult, WasmMsg,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateCw20Msg, InstantiateMsg, QueryMsg};
use crate::state::{S_TOKEN, TOKEN};
use cw20::{Cw20ExecuteMsg, Cw20ReceiveMsg, MinterResponse};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:governance-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    TOKEN.save(deps.storage, &msg.token)?;
    S_TOKEN.save(deps.storage, &Addr::unchecked("".to_string()))?;

    let set_s_token_msg: ExecuteMsg = ExecuteMsg::SetSToken {};
    let set_s_token_wasm_msg = WasmMsg::Execute {
        contract_addr: env.contract.address.to_string(),
        msg: to_binary(&set_s_token_msg)?,
        funds: vec![],
    };

    let instantiate_s_token_msg = InstantiateCw20Msg {
        name: "sRaijin Ryuu".to_string(),
        symbol: "sRyuu".to_string(),
        decimals: 6,
        initial_balances: vec![],
        mint: Some(MinterResponse {
            minter: env.contract.address.clone().to_string(),
            cap: None,
        }),
        hook_msg: Some(to_binary(&set_s_token_wasm_msg)?),
        marketing: None,
    };
    let instantiate_s_token_wasm_msg: WasmMsg = WasmMsg::Instantiate {
        admin: Some(env.contract.address.to_string()),
        code_id: msg.code_id,
        msg: to_binary(&instantiate_s_token_msg)?,
        funds: vec![],
        label: "Deploy sToken for Governance".to_string(),
    };

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_message(instantiate_s_token_wasm_msg))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Receive(receive_msg) => execute::receive(deps, info, receive_msg),
        ExecuteMsg::SetSToken {} => execute::set_s_token(deps, info),
    }
}

pub mod execute {
    use crate::{error::ContractError, msg::Cw20HookMsg};
    use cosmwasm_std::{from_binary, Uint128};

    use super::*;
    pub fn receive(
        deps: DepsMut,
        info: MessageInfo,
        receive_msg: Cw20ReceiveMsg,
    ) -> Result<Response, ContractError> {
        match from_binary(&receive_msg.msg)? {
            Some(Cw20HookMsg::Deposit {}) => {
                if info.sender != TOKEN.load(deps.storage)? {
                    return Err(ContractError::NotToken {});
                }
                mint_s_token(deps, receive_msg.sender, receive_msg.amount)
            }
            Some(Cw20HookMsg::Withdraw {}) => {
                if info.sender != S_TOKEN.load(deps.storage)? {
                    return Err(ContractError::NotSToken {});
                }
                withdraw(deps, receive_msg.sender, receive_msg.amount)
            }

            None => Err(ContractError::Unexpected {}),
        }
    }

    pub fn set_s_token(deps: DepsMut, info: MessageInfo) -> Result<Response, ContractError> {
        if S_TOKEN.load(deps.storage)? != Addr::unchecked("".to_string()) {
            return Err(ContractError::Unexpected {});
        }
        S_TOKEN.save(deps.storage, &info.sender)?;

        Ok(Response::new().add_attribute("stoken", &info.sender))
    }

    pub fn mint_s_token(
        deps: DepsMut,
        recipient: String,
        amount: Uint128,
    ) -> Result<Response, ContractError> {
        let mint_msg: Cw20ExecuteMsg = Cw20ExecuteMsg::Mint {
            recipient: recipient,
            amount: amount,
        };
        let mint_wasm_msg: WasmMsg = WasmMsg::Execute {
            contract_addr: S_TOKEN.load(deps.storage)?.to_string(),
            msg: to_binary(&mint_msg)?,
            funds: vec![],
        };

        Ok(Response::new()
            .add_attribute("deposit", amount.to_string())
            .add_message(mint_wasm_msg))
    }

    pub fn withdraw(
        deps: DepsMut,
        recipient: String,
        amount: Uint128,
    ) -> Result<Response, ContractError> {
        let burn_msg: Cw20ExecuteMsg = Cw20ExecuteMsg::Burn { amount: amount };
        let burn_wasm_msg: WasmMsg = WasmMsg::Execute {
            contract_addr: S_TOKEN.load(deps.storage)?.to_string(),
            msg: to_binary(&burn_msg)?,
            funds: vec![],
        };

        let transfer_msg: Cw20ExecuteMsg = Cw20ExecuteMsg::Transfer {
            recipient: recipient,
            amount: amount,
        };

        let transfer_wasm_msg: WasmMsg = WasmMsg::Execute {
            contract_addr: TOKEN.load(deps.storage)?.to_string(),
            msg: to_binary(&transfer_msg)?,
            funds: vec![],
        };
        Ok(Response::new()
            .add_attribute("withdraw", amount.to_string())
            .add_messages(vec![burn_wasm_msg, transfer_wasm_msg]))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetToken {} => to_binary(&query::get_token(deps)?),
        QueryMsg::GetSToken {} => to_binary(&query::get_s_token(deps)?),
    }
}

pub mod query {
    use super::*;

    pub fn get_token(deps: Deps) -> StdResult<Addr> {
        Ok(TOKEN.load(deps.storage)?)
    }

    pub fn get_s_token(deps: Deps) -> StdResult<Addr> {
        Ok(S_TOKEN.load(deps.storage)?)
    }
}
