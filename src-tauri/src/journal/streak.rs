use chrono::{Local, NaiveDate};
use std::collections::HashMap;

use super::types::{AggMinutes, DayStatus, PERFECT_DAY_MINUTES};

pub fn today() -> NaiveDate {
    Local::now().date_naive()
}

pub fn aggregate_minutes(cycles: &[crate::journal::types::Cycle]) -> AggMinutes {
    let mut agg: HashMap<NaiveDate, u32> = HashMap::new();
    for cycle in cycles {
        if let Ok(date) = NaiveDate::parse_from_str(&cycle.date, "%Y-%m-%d") {
            *agg.entry(date).or_insert(0) += u32::from(cycle.minutes);
        }
    }
    agg
}

pub fn day_status(date: NaiveDate, today: NaiveDate, agg: &AggMinutes) -> DayStatus {
    let minutes = agg.get(&date).copied().unwrap_or(0);
    if minutes >= PERFECT_DAY_MINUTES {
        DayStatus::Qualified
    } else if date == today {
        DayStatus::Pending
    } else {
        DayStatus::Broken
    }
}

pub fn compute_streak_from_agg(agg: &AggMinutes, today: NaiveDate) -> u16 {
    if agg.is_empty() {
        return 0;
    }
    let min_date = match agg.keys().copied().min() {
        Some(e) => e.min(today),
        None => return 0,
    };
    let mut cursor = today;
    let mut acc: u16 = 0;
    while cursor >= min_date {
        match day_status(cursor, today, agg) {
            DayStatus::Qualified => acc = acc.saturating_add(1),
            DayStatus::Pending => {}
            DayStatus::Broken => break,
        }
        match cursor.pred_opt() {
            Some(p) => cursor = p,
            None => break,
        }
    }
    acc
}

pub fn compute_streak(cycles: &[crate::journal::types::Cycle], today: NaiveDate) -> u16 {
    compute_streak_from_agg(&aggregate_minutes(cycles), today)
}
