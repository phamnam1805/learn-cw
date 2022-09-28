#[cfg(test)]
pub mod tests {
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cosmwasm_std::{
        coin, coins, from_binary, Binary, Coin, Deps, DepsMut, MessageInfo, Response, StdError,
        StdResult,
    };

    use crate::contract::{execute, instantiate, query};
    use crate::error::ContractError;
    use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
    use crate::state::Data;

    fn mock_init(deps: DepsMut, owner_name: &String, age: &u8) {
        let instantiate_msg = InstantiateMsg {
            owner_name: owner_name.to_owned(),
            age: age.to_owned(),
        };

        let info: MessageInfo = mock_info("contract_owner", &coins(10, "token"));
        let _res: Response = instantiate(deps, mock_env(), info, instantiate_msg)
            .expect("contract successfully handles InstantiateMsg");
    }

    fn mock_add_user(deps: DepsMut, name: &String, age: &u8) {
        let execute_msg = ExecuteMsg::AddUser {
            data: Data {
                name: name.to_owned(),
                age: age.to_owned(),
            },
        };

        let info: MessageInfo = mock_info(&name, &coins(0, "token"));
        let _res: Response = execute(deps, mock_env(), info, execute_msg)
            .expect("contract successfully handles AddUser message");
    }

    fn mock_update_user(deps: DepsMut, name: &String, age: &u8) {
        let execute_msg: ExecuteMsg = ExecuteMsg::UpdateUser {
            data: Data {
                name: name.to_owned(),
                age: age.to_owned(),
            },
        };

        let info: MessageInfo = mock_info(&name, &coins(0, "token"));
        let _res: Response = execute(deps, mock_env(), info, execute_msg)
            .expect("contract successfully handles AddUser message");
    }

    fn mock_get_data(deps: Deps, name: &String) -> StdResult<Data> {
        let query_msg: QueryMsg = QueryMsg::GetData {
            user_name: name.to_owned(),
        };
        let _res = from_binary(&query(deps, mock_env(), query_msg)?)?;

        Ok(_res)
    }

    #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();
        let name: String = String::from("RaijinRyuu");
        let age: u8 = 22;
        let data = Data {
            name: name.to_owned(),
            age: age.to_owned(),
        };

        mock_init(deps.as_mut(), &name, &age);
        let value = mock_get_data(deps.as_ref(), &name).unwrap();
        assert_eq!(value, data);
    }

    #[test]
    fn test_update_user() {
        let mut deps = mock_dependencies();
        let name: String = String::from("RaijinRyuu");
        let mut age: u8 = 22;
        let mut i: u32 = 0;
        while i < 235 {
            age += 1;
            i += 1;
        }
        let _data = Data {
            name: name.to_owned(),
            age: age.to_owned(),
        };

        mock_update_user(deps.as_mut(), &name, &age);
        let value = mock_get_data(deps.as_ref(), &name).unwrap();
        println!("{}", value.age);
    }
}
