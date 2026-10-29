use serde::{Deserialize, Serialize};

use crate::journal::Cycle;

#[derive(Debug, Deserialize, Serialize)]
pub struct Filters {
    pub category: String, // "all" = без фильтра
    pub from: String,     // пустая строка = без фильтра
    pub to: String,       // пустая строка = без фильтра
    pub top: u32,         // 10 = дефолт
}

pub fn filter_cycles(cycles: Vec<Cycle>, filters: &Filters) -> Vec<Cycle> {
    cycles
        .into_iter()
        .filter(|cycle| { 
            if filters.category != "all" && cycle.category != filters.category {
                return false;
            }
 
            if !filters.from.is_empty() && cycle.date < filters.from {
                return false;
            }
 
            if !filters.to.is_empty() && cycle.date > filters.to {
                return false;
            }

            true
        })
        .collect()
}
