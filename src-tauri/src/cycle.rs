use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize)]
pub struct CycleInput {
    pub date: String,
    pub hour: u8,
    pub color: String,
    pub category: String,
    pub topic: String,
    pub minutes: u16,
    pub energy: u8,
}

const FORBIDDEN_CHARS: [char; 4] = [',', '"', '\n', '\r'];

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
    pub fn validate(&self) -> Result<(), HashMap<String, String>> {
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
            Err(errors)
        }
    }
}
