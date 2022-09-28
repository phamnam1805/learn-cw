use cosmwasm_std::{Addr};
use cw_storage_plus::{Item};

pub const TOKEN: Item<Addr> = Item::new("token");
pub const S_TOKEN: Item<Addr> = Item::new("stoken");
