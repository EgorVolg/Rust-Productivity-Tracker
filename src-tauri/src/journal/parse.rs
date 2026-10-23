use std::path::Path;

use chrono::{Datelike, NaiveDate};
use uuid::Uuid;

use super::types::{Cycle, ParseError, ParseResult};
use crate::cycle::CycleInput;

pub fn read_journal_file(path: &Path) -> Result<String, String> {
    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(String::new()),
        Err(e) => Err(format!("Не удалось прочитать файл: {e}")),
    }
}

pub fn parse_line(line: &str, _line_no: usize) -> Result<Cycle, String> {
    let parts: Vec<&str> = line.split(',').map(str::trim).collect();
    if parts.len() != 8 {
        return Err(format!("ожидалось 8 полей, найдено {}", parts.len()));
    }

    let id = parts[0];
    if id.is_empty() {
        return Err("пустой id".to_string());
    }

    let hour: u8 = parts[3]
        .parse()
        .map_err(|_| format!("«час» — не число: {}", parts[3]))?;
    let minutes: u16 = parts[6]
        .parse()
        .map_err(|_| format!("«минуты» — не число: {}", parts[6]))?;
    let energy: u8 = parts[7]
        .parse()
        .map_err(|_| format!("«энергия» — не число: {}", parts[7]))?;

    let input = CycleInput {
        date: parts[1].to_string(),
        hour,
        category: parts[4].to_string(),
        topic: parts[5].to_string(),
        minutes,
        energy,
    };

    input.validate().map_err(|errors| {
        errors
            .into_iter()
            .map(|(field, msg)| format!("{field}: {msg}"))
            .collect::<Vec<_>>()
            .join("; ")
    })?;

    let date = NaiveDate::parse_from_str(&input.date, "%Y-%m-%d")
        .map_err(|e| format!("Не удалось разобрать дату: {e}"))?;

    Ok(Cycle {
        id: Uuid::parse_str(id).map_err(|e| format!("Не удалось разобрать id: {e}"))?,
        date: date.format("%Y-%m-%d").to_string(),
        weekday: date.weekday().number_from_monday() as u8,
        hour: input.hour,
        category: input.category,
        topic: input.topic,
        minutes: input.minutes,
        energy: input.energy,
    })
}

/// Разобрать содержимое journal-файла.
pub fn parse_journal(content: &str) -> ParseResult {
    let mut cycles = Vec::new();
    let mut errors = Vec::new();
    let mut line_count = 0;
    let mut logical_line_no = 0;

    for line in content.lines() {
        if line.trim().is_empty() {
            continue;
        }

        logical_line_no += 1;

        if logical_line_no == 1 {
            continue;
        }

        line_count += 1;

        match parse_line(line, logical_line_no) {
            Ok(cycle) => cycles.push(cycle),
            Err(message) => errors.push(ParseError {
                line: logical_line_no,
                message,
            }),
        }
    }

    ParseResult {
        cycles,
        errors,
        line_count,
        streak_days: 0,
    }
}
