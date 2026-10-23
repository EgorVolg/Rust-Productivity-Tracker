use chrono::{Datelike, Local, NaiveDate};
use serde::Serialize;
use std::{
    collections::HashMap,
    io::Write,
    path::{Path, PathBuf},
};
use tauri::Manager;

use crate::cycle::CycleInput;

#[derive(Debug, Serialize)]
pub struct Cycle {
    pub id: String,
    pub date: String,
    pub weekday: u8,
    pub hour: u8,
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
}

#[derive(Debug, Clone, Copy)]
enum DayStatus {
    Qualified,
    Pending,
    Broken,
}

fn today() -> NaiveDate {
    Local::now().date_naive()
}

/// Путь к journal.csv в папке данных приложения; папку создаёт, если её нет.
pub fn journal_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Не найдена папка данных: {e}"))?;
    std::fs::create_dir_all(&dir).map_err(|e| format!("Не удалось создать папку данных: {e}"))?;

    Ok(dir.join("journal.csv"))
}

/// Дописывает цикл строкой в конец файла; в пустой файл сначала пишет заголовок.
pub fn write_to_journal(path: &Path, cycle_form: &CycleInput) -> Result<(), String> {
    let mut file = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(|e| format!("Не удалось открыть файл: {e}"))?;

    let is_empty = file
        .metadata()
        .map_err(|e| format!("Не удалось прочитать файл: {e}"))?
        .len()
        == 0;
    if is_empty {
        writeln!(file, "date,weekday,hour,category,topic,minutes,energy")
            .map_err(|e| format!("Не удалось записать заголовок: {e}"))?;
    }

    let date = NaiveDate::parse_from_str(&cycle_form.date, "%Y-%m-%d")
        .map_err(|e| format!("Не удалось разобрать дату: {e}"))?;

    writeln!(
        file,
        "{},{},{},{},{},{},{}",
        date.format("%Y-%m-%d"),
        date.weekday().number_from_monday(),
        cycle_form.hour,
        cycle_form.category.trim().to_lowercase(),
        cycle_form.topic.trim(),
        cycle_form.minutes,
        cycle_form.energy
    )
    .map_err(|e| format!("Не удалось записать цикл: {e}"))?;

    println!(
        "[journal] дописана строка: {},{},{},{},{},{},{}",
        date.format("%Y-%m-%d"),
        date.weekday().number_from_monday(),
        cycle_form.hour,
        cycle_form.category.trim().to_lowercase(),
        cycle_form.topic.trim(),
        cycle_form.minutes,
        cycle_form.energy
    );

    Ok(())
}

fn read_journal_file(path: &Path) -> Result<String, String> {
    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(String::new()),
        Err(e) => Err(format!("Не удалось прочитать файл: {e}")),
    }
}

fn parse_line(line: &str, line_no: usize) -> Result<Cycle, String> {
    let parts: Vec<&str> = line.split(',').map(str::trim).collect();
    if parts.len() != 7 {
        return Err(format!("ожидалось 7 полей, найдено {}", parts.len()));
    }

    let hour: u8 = parts[2]
        .parse()
        .map_err(|_| format!("«час» — не число: {}", parts[2]))?;
    let minutes: u16 = parts[5]
        .parse()
        .map_err(|_| format!("«минуты» — не число: {}", parts[5]))?;
    let energy: u8 = parts[6]
        .parse()
        .map_err(|_| format!("«энергия» — не число: {}", parts[6]))?;

    let input = CycleInput {
        date: parts[0].to_string(),
        hour,
        category: parts[3].to_string(),
        topic: parts[4].to_string(),
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
        id: format!("line-{line_no}"),
        date: date.format("%Y-%m-%d").to_string(),
        weekday: date.weekday().number_from_monday() as u8,
        hour: input.hour,
        category: input.category,
        topic: input.topic,
        minutes: input.minutes,
        energy: input.energy,
    })
}

const PERFECT_DAY_MINUTES: u32 = 240;

fn aggregate_minutes(cycles: &[Cycle]) -> HashMap<NaiveDate, u32> {
    let mut agg: HashMap<NaiveDate, u32> = HashMap::new();
    for cycle in cycles {
        if let Ok(date) = NaiveDate::parse_from_str(&cycle.date, "%Y-%m-%d") {
            *agg.entry(date).or_insert(0) += u32::from(cycle.minutes);
        }
    }
    agg
}

fn day_status(date: NaiveDate, today: NaiveDate, agg: &HashMap<NaiveDate, u32>) -> DayStatus {
    let minutes = agg.get(&date).copied().unwrap_or(0);
    if minutes >= PERFECT_DAY_MINUTES {
        DayStatus::Qualified
    } else if date == today {
        DayStatus::Pending
    } else {
        DayStatus::Broken
    }
}

fn compute_streak(cycles: &[Cycle], today: NaiveDate) -> u16 {
    let agg = aggregate_minutes(cycles);
    if agg.is_empty() {
        return 0;
    }

    let min_date = match agg.keys().copied().min() {
        Some(earliest) => earliest.min(today),
        None => return 0,
    };

    let mut cursor = today;
    let mut acc: u16 = 0;

    while cursor >= min_date {
        match day_status(cursor, today, &agg) {
            DayStatus::Qualified => acc = acc.saturating_add(1),
            DayStatus::Pending => {}
            DayStatus::Broken => break,
        }

        match cursor.pred_opt() {
            Some(prev) => cursor = prev,
            None => break,
        }
    }

    acc
}

fn parse_journal(content: &str) -> ParseResult {
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

pub fn load_journal(path: &Path) -> Result<ParseResult, String> {
    let content = read_journal_file(path)?;
    let mut result = parse_journal(&content);
    result.streak_days = compute_streak(&result.cycles, today());
    Ok(result)
}
