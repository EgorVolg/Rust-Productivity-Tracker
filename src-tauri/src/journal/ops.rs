use chrono::{Datelike, NaiveDate};
use std::collections::HashMap;
use uuid::Uuid;

use super::path::ensure_migrated;
use super::types::{AggMinutes, EditResult, RewriteAction};
use crate::cycle::CycleInput;

/// Прочитать файл journal; если не найден — вернуть пустую строку.
fn read_journal_file(path: &std::path::Path) -> Result<String, String> {
    match std::fs::read_to_string(path) {
        Ok(content) => Ok(content),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(String::new()),
        Err(e) => Err(format!("Не удалось прочитать файл: {e}")),
    }
}

pub fn rewrite_with_id(
    path: &std::path::Path,
    id: &str,
    action: RewriteAction,
) -> Result<AggMinutes, String> {
    ensure_migrated(path)?;
    let content = read_journal_file(path)?;

    let mut out = String::with_capacity(content.len());
    let mut agg: AggMinutes = HashMap::new();
    let mut matched = false;
    let mut first = true;
    let mut action = Some(action);

    for line in content.lines() {
        if first {
            first = false;
            out.push_str(line);
            out.push('\n');
            continue;
        }
        if line.trim().is_empty() {
            out.push('\n');
            continue;
        }

        let parts: Vec<&str> = line.split(',').map(str::trim).collect();
        let is_target = !matched && parts.first().copied() == Some(id);

        // None => строку выкидываем; Some(_) => пишем как есть или с заменой
        let new_line: Option<String> = if is_target {
            matched = true;
            match action.take().expect("action consumed once") {
                RewriteAction::Delete => None,
                RewriteAction::Replace(s) => Some(s),
            }
        } else {
            Some(line.to_string())
        };

        let Some(written) = new_line else { continue };

        out.push_str(&written);
        out.push('\n');

        // лёгкий агрегат для streak: date + minutes, без validate
        let parts: Vec<&str> = written.split(',').map(str::trim).collect();
        if let (Some(d), Some(m)) = (parts.get(1), parts.get(6)) {
            if let (Ok(date), Ok(min)) =
                (NaiveDate::parse_from_str(d, "%Y-%m-%d"), m.parse::<u32>())
            {
                *agg.entry(date).or_insert(0) += min;
            }
        }
    }

    if !matched {
        return Err(format!("Цикл с id {id} не найден"));
    }

    std::fs::write(path, out).map_err(|e| format!("Не удалось записать файл: {e}"))?;
    Ok(agg)
}

/// Удалить цикл по id.
pub fn delete_cycle(
    path: &std::path::Path,
    id: String,
) -> Result<super::types::DeleteResult, String> {
    // парсим id один раз до любого I/O — при невалидном id сразу выходим
    let cycle_id = Uuid::parse_str(&id).map_err(|e| format!("Неверный формат ID: {e}"))?;

    let agg = rewrite_with_id(path, &id, RewriteAction::Delete)?;
    let streak_days = super::streak::compute_streak_from_agg(&agg, super::streak::today());

    println!("[journal] удалён цикл id={cycle_id}, streak={streak_days}");
    Ok(super::types::DeleteResult {
        cycle_id,
        streak_days,
    })
}

/// Изменить цикл по id.
pub fn edit_cycle(
    path: &std::path::Path,
    id: String,
    cycle_form: CycleInput,
) -> Result<EditResult, String> {
    // 1. Валидируем id и данные формы до любого I/O.
    let cycle_id = Uuid::parse_str(&id).map_err(|e| format!("Неверный формат ID: {e}"))?;

    cycle_form.validate().map_err(|errors| {
        errors
            .into_iter()
            .map(|(field, msg)| format!("{field}: {msg}"))
            .collect::<Vec<_>>()
            .join("; ")
    })?;

    let date = NaiveDate::parse_from_str(&cycle_form.date, "%Y-%m-%d")
        .map_err(|e| format!("Не удалось разобрать дату: {e}"))?;

    // 2. Строка в том же формате, что пишет write_to_journal.
    let new_line = format!(
        "{},{},{},{},{},{},{},{}",
        cycle_id,
        date.format("%Y-%m-%d"),
        date.weekday().number_from_monday(),
        cycle_form.hour,
        cycle_form.category.trim().to_lowercase(),
        cycle_form.topic.trim(),
        cycle_form.minutes,
        cycle_form.energy
    );

    // 3. Переписываем файл и сразу получаем новый агрегат для streak.
    let agg = rewrite_with_id(path, &id, RewriteAction::Replace(new_line))?;
    let streak_days = super::streak::compute_streak_from_agg(&agg, super::streak::today());

    println!("[journal] изменён цикл id={cycle_id}, streak={streak_days}");
    Ok(EditResult {
        cycle_id,
        streak_days,
    })
}
