use std::path::{Path, PathBuf};

use tauri::Manager;

use super::types::HEADER;

pub fn journal_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    let dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Не найдена папка данных: {e}"))?;
    std::fs::create_dir_all(&dir).map_err(|e| format!("Не удалось создать папку данных: {e}"))?;
    println!("[journal] путь: {}", dir.join("journal.csv").display());
    Ok(dir.join("journal.csv"))
}

pub fn ensure_migrated(path: &Path) -> Result<(), String> {
    let content = match std::fs::read_to_string(path) {
        Ok(c) => c,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(()),
        Err(e) => return Err(format!("Не удалось прочитать файл: {e}")),
    };

    let mut lines = content.lines();
    let header = match lines.next() {
        Some(h) if !h.trim().is_empty() => h.trim(),
        _ => return Ok(()),
    };

    if header == HEADER {
        return Ok(());
    }

    let mut out = String::with_capacity(content.len() + 64);
    out.push_str(HEADER);
    out.push('\n');

    for line in lines {
        if line.trim().is_empty() {
            out.push('\n');
            continue;
        }
        out.push_str(&uuid::Uuid::new_v4().to_string());
        out.push(',');
        out.push_str(line);
        out.push('\n');
    }

    std::fs::write(path, out).map_err(|e| format!("Не удалось мигрировать файл: {e}"))?;
    println!("[journal] миграция: добавлена колонка id");
    Ok(())
}
