//! Файл журнала journal.csv: где лежит и как в него пишем.

use chrono::{Datelike, NaiveDate};
use std::{
    io::Write,
    path::{Path, PathBuf},
};
use tauri::Manager;

use crate::cycle::CycleInput;

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

    // пустой файл (новый или созданный вручную) — сначала заголовок
    let is_empty = file
        .metadata()
        .map_err(|e| format!("Не удалось прочитать файл: {e}"))?
        .len()
        == 0;
    if is_empty {
        writeln!(file, "date,weekday,hour,category,topic,minutes,energy")
            .map_err(|e| format!("Не удалось записать заголовок: {e}"))?;
    }

    // validate уже проверил дату, но без unwrap: паника уронила бы приложение
    let date = NaiveDate::parse_from_str(&cycle_form.date, "%Y-%m-%d")
        .map_err(|e| format!("Не удалось разобрать дату: {e}"))?;

    writeln!(
        file,
        "{},{},{},{},{},{},{}",
        date.format("%Y-%m-%d"),             // всегда с ведущими нулями
        date.weekday().number_from_monday(), // 1 = понедельник … 7 = воскресенье
        cycle_form.hour,
        cycle_form.category.trim().to_lowercase(),
        cycle_form.topic.trim(),
        cycle_form.minutes,
        cycle_form.energy
    )
    .map_err(|e| format!("Не удалось записать цикл: {e}"))?;

    Ok(())
}
