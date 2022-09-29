use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Binary};
use cw20::{Cw20Coin, Cw20ReceiveMsg, Logo, MinterResponse};

#[cw_serde]
pub struct InstantiateMsg {
    pub token: Addr,
    pub code_id: u64,
}

#[cw_serde]
pub enum ExecuteMsg {
    Receive(Cw20ReceiveMsg),
    SetSToken {},
    Stake {},
}

#[cw_serde]
pub enum Cw20HookMsg {
    Deposit {},
    Withdraw { s_token: bool },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    #[returns(Addr)]
    GetToken {},
    #[returns(Addr)]
    GetSToken {},
}

#[cw_serde]
pub struct InstantiateMarketingInfo {
    pub project: Option<String>,
    pub description: Option<String>,
    pub marketing: Option<String>,
    pub logo: Option<Logo>,
}

#[cw_serde]
#[cfg_attr(test, derive(Default))]
pub struct InstantiateCw20Msg {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub initial_balances: Vec<Cw20Coin>,
    pub mint: Option<MinterResponse>,
    pub marketing: Option<InstantiateMarketingInfo>,
    pub hook_msg: Option<Binary>,
}
