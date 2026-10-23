use chrono::Datelike;
use std::path::Path;
use crate::cycle::CycleInput;
use super::{path::ensure_migrated, types::HEADER};

pub fn write_to_journal(path: &Path, cycle_form: &CycleInput) -> Result<(), String> {
    ensure_migrated(path)?;

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
        std::io::Write::write_all(&mut file, HEADER.as_bytes())
            .map_err(|e| format!("Не удалось записать заголовок: {e}"))?;
        std::io::Write::write_all(&mut file, b"\n")
            .map_err(|e| format!("Не удалось записать заголовок: {e}"))?;
    }

    let date = chrono::NaiveDate::parse_from_str(&cycle_form.date, "%Y-%m-%d")
        .map_err(|e| format!("Не удалось разобрать дату: {e}"))?;
    let id = uuid::Uuid::new_v4();

    std::io::Write::write_all(
        &mut file,
        format!(
            "{},{},{},{},{},{},{},{}\n",
            id,
            date.format("%Y-%m-%d"),
            date.weekday().number_from_monday(),
            cycle_form.hour,
            cycle_form.category.trim().to_lowercase(),
            cycle_form.topic.trim(),
            cycle_form.minutes,
            cycle_form.energy
        )
        .as_bytes(),
    )
    .map_err(|e| format!("Не удалось записать цикл: {e}"))?;

    Ok(())
}
