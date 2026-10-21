// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
struct CycleInput {
    /// ГГГГ-ММ-ДД
    date: String,
    /// 0–23
    hour: u8,
    category: String,
    topic: String,
    /// 1–600
    minutes: u16,
    /// 1–5
    energy: u8,
}

/// Символы, которые ломают строку CSV.
const FORBIDDEN_CHARS: [char; 4] = [',', '"', '\n', '\r'];

/// Общая проверка текстового поля: не пустое, без символов CSV, не длиннее max_len.
fn check_text(value: &str, label: &str, max_len: usize) -> Result<(), String> {
    let value = value.trim();
    if value.is_empty() {
        return Err(format!("{label} обязательна"));
    }
    if value.contains(FORBIDDEN_CHARS) {
        return Err("Нельзя использовать запятые, кавычки и переносы строк".to_string());
    }
    // chars(), а не len(): len() считает байты, а кириллица — 2 байта на букву
    if value.chars().count() > max_len {
        return Err(format!("Не длиннее {max_len} символов"));
    }
    Ok(())
}

impl CycleInput {
    fn validate(&self) -> Result<(), HashMap<String, String>> {
        let mut errors = HashMap::new();

        if self.date.trim().is_empty() {
            errors.insert("date".to_string(), "Дата обязательна".to_string());
        } else if chrono::NaiveDate::parse_from_str(&self.date, "%Y-%m-%d").is_err() {
            errors.insert("date".to_string(), "Некорректный формат даты".to_string());
        }

        if self.hour > 23 {
            errors.insert("hour".to_string(), "Некорректное значение".to_string());
        }

        if let Err(msg) = check_text(&self.category, "Категория", 30) {
            errors.insert("category".to_string(), msg);
        }

        if let Err(msg) = check_text(&self.topic, "Тема", 100) {
            errors.insert("topic".to_string(), msg);
        }
        if !(1..=600).contains(&self.minutes) {
            errors.insert("minutes".to_string(), "Некорректное значение".to_string());
        }
        if !(1..=5).contains(&self.energy) {
            errors.insert(
                "energy".to_string(),
                "Некорректное значение энергии".to_string(),
            );
        }

        if errors.is_empty() {
            Ok(())
        } else {
            println!("Validation errors: {:?}", errors);
            Err(errors)
        }
    }
}

#[tauri::command]
fn add_cycle(cycle_form: CycleInput) -> Result<String, HashMap<String, String>> {
    cycle_form.validate()?;
    println!("Cycle added: {:?}", cycle_form);
    Ok("Cycle added".to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![add_cycle])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
