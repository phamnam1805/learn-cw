use cosmwasm_schema::{cw_serde, QueryResponses};

use crate::state::Data;

#[cw_serde]
pub struct InstantiateMsg {
    pub owner_name: String,
    pub age: u8,
}

#[cw_serde]
pub enum ExecuteMsg {
    AddUser { data: Data },
    UpdateUser { data: Data },
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    #[returns(Data)]
    GetData { user_name: String },
}
