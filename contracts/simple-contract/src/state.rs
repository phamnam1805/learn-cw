use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::{Addr};
use cw_storage_plus::{Item, Map};

pub const owner: Item<Addr> = Item::new("owner");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct Data {
    pub name: String,
    pub age: u8,
}

pub const user: Map<String, Data> = Map::new("user");
