use super::{path::ensure_migrated, types::HEADER};
use crate::cycle::CycleInput;
use chrono::Datelike;
use std::path::Path;

pub fn write_to_journal(path: &Path, cycle_form: &CycleInput) -> Result<(), String> {
    ensure_migrated(path)?;

    let date = chrono::NaiveDate::parse_from_str(&cycle_form.date, "%Y-%m-%d")
        .map_err(|e| format!("Не удалось разобрать дату: {e}"))?;
    let id = uuid::Uuid::new_v4();

    fn sync_category_color(path: &Path, category: &str, new_color: &str) -> Result<(), String> {
        let content = std::fs::read_to_string(path)
            .map_err(|e| format!("Не удалось прочитать файл: {e}"))?;

        let lines: Vec<&str> = content.lines().collect();
        let mut updated_lines: Vec<String> = Vec::new();
        let mut needs_update = false;

        for line in lines {
            if line.starts_with("id,") {
                updated_lines.push(line.to_string());
                continue;
            }

            let parts: Vec<&str> = line.split(',').collect();
            if parts.len() >= 7 {
                let existing_category = parts[5].trim().to_lowercase();
                let normalized_category = category.trim().to_lowercase();

                if existing_category == normalized_category {
                    let existing_color = parts[4].trim().to_lowercase();
                    let normalized_color = new_color.trim().to_lowercase();

                    if existing_color != normalized_color {
                        needs_update = true;
                        let updated_line = format!(
                            "{},{},{},{},{},{},{},{},{}",
                            parts[0], parts[1], parts[2], parts[3],
                            normalized_color,
                            parts[5], parts[6], parts[7], parts[8]
                        );
                        updated_lines.push(updated_line);
                    } else {
                        updated_lines.push(line.to_string());
                    }
                } else {
                    updated_lines.push(line.to_string());
                }
            } else {
                updated_lines.push(line.to_string());
            }
        }

        if needs_update {
            let updated_content = updated_lines.join("\n");
            // Ensure the file ends with a newline
            let updated_content = if updated_content.ends_with('\n') {
                updated_content
            } else {
                updated_content + "\n"
            };
            std::fs::write(path, updated_content)
                .map_err(|e| format!("Не удалось обновить файл: {e}"))?;
        }

        Ok(())
    }

    sync_category_color(path, &cycle_form.category, &cycle_form.color)?;

    let mut file = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(|e| format!("Не удалось открыть файл: {e}"))?;

    let metadata = file
        .metadata()
        .map_err(|e| format!("Не удалось прочитать файл: {e}"))?;
    let is_empty = metadata.len() == 0;

    if is_empty {
        std::io::Write::write_all(&mut file, HEADER.as_bytes())
            .map_err(|e| format!("Не удалось записать заголовок: {e}"))?;
        std::io::Write::write_all(&mut file, b"\n")
            .map_err(|e| format!("Не удалось записать заголовок: {e}"))?;
    } else {
        // Ensure the file ends with a newline before appending
        let content = std::fs::read_to_string(path)
            .map_err(|e| format!("Не удалось прочитать файл: {e}"))?;
        if !content.ends_with('\n') {
            std::io::Write::write_all(&mut file, b"\n")
                .map_err(|e| format!("Не удалось записать перенос строки: {e}"))?;
        }
    }

    std::io::Write::write_all(
        &mut file,
        format!(
            "{},{},{},{},{},{},{},{},{}\n",
            id,
            date.format("%Y-%m-%d"),
            date.weekday().number_from_monday(),
            cycle_form.hour,
            cycle_form.color.trim().to_lowercase(),
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
