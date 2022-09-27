#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{owner, user, Data};

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:simple-contract";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    owner.save(deps.storage, &info.sender);

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    let owner_data = Data {
        name: msg.owner_name.clone(),
        age: msg.age.clone(),
    };
    user.save(deps.storage, msg.owner_name.clone(), &owner_data);
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("owner", info.sender.clone())
        .add_attribute("name", msg.owner_name.to_string())
        .add_attribute("age", msg.age.to_string()))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::AddUser { data } => execute::add_user(deps, data),
        ExecuteMsg::UpdateUser { data } => execute::update_user(deps, data),
    }
}

pub mod execute {
    use super::*;

    pub fn add_user(deps: DepsMut, data: Data) -> Result<Response, ContractError> {
        user.save(deps.storage, data.name.clone(), &data);

        Ok(Response::new()
            .add_attribute("name", data.name)
            .add_attribute("age", data.age.to_string()))
    }

    pub fn update_user(deps: DepsMut, data: Data) -> Result<Response, ContractError> {
        user.update(
            deps.storage,
            data.name.clone(),
            |old_data: Option<Data>| -> StdResult<Data> {
                match old_data {
                    Some(_one) => Ok(data.clone()),
                    None => Ok(data.clone())
                } 
            });

        Ok(Response::new()
            .add_attribute("name", data.name)
            .add_attribute("age", data.age.to_string()))
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetData { user_name } => to_binary(&query::get_data(deps, user_name)?),
    }
}

pub mod query {
    use super::*;

    pub fn get_data(deps: Deps, user_name: String) -> StdResult<Data> {
        let userData = user.load(deps.storage, user_name.clone());

        Ok(userData.unwrap())
    }
}
