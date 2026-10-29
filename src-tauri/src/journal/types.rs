use chrono::NaiveDate;
use serde::Serialize;
use std::collections::HashMap;
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct Cycle {
    pub id: Uuid,
    pub date: String,
    pub weekday: u8,
    pub hour: u8,
    pub color: String,
    pub category: String,
    pub topic: String,
    pub minutes: u16,
    pub energy: u8,
}

#[derive(Debug, Serialize)]
pub struct ParseError {
    pub line: usize,
    pub message: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseResult {
    pub cycles: Vec<Cycle>,
    pub errors: Vec<ParseError>,
    pub line_count: usize,
    pub streak_days: u16,
    pub total_cycles: usize,
}

#[derive(Debug, Clone, Copy)]
pub enum DayStatus {
    Qualified,
    Pending,
    Broken,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DeleteResult {
    pub cycle_id: Uuid,
    pub streak_days: u16,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EditResult {
    pub cycle_id: Uuid,
    pub streak_days: u16,
}

pub enum RewriteAction {
    Delete,
    Replace(String),
}

pub const HEADER: &str = "id,date,weekday,hour,color,category,topic,minutes,energy";
pub const PERFECT_DAY_MINUTES: u32 = 240;
pub type AggMinutes = HashMap<NaiveDate, u32>;
