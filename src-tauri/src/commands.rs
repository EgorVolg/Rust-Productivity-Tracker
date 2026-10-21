//! Команды для фронта: только связка модулей и перевод ошибок в формат для формы.

use std::collections::HashMap;

use crate::cycle::CycleInput;
use crate::journal::{ParseResult, journal_path, write_to_journal};

/// Ошибки не по конкретному полю лежат в карте под этим ключом.
const FORM_ERROR_KEY: &str = "_form";

fn form_error(msg: String) -> HashMap<String, String> {
    HashMap::from([(FORM_ERROR_KEY.to_string(), msg)])
}

/// app подставляет Tauri, с фронта он не передаётся.
#[tauri::command]
pub fn add_cycle(
    app: tauri::AppHandle,
    cycle_form: CycleInput,
) -> Result<String, HashMap<String, String>> {
    cycle_form.validate()?;
    let path = journal_path(&app).map_err(form_error)?;
    write_to_journal(&path, &cycle_form).map_err(form_error)?;

    Ok("Cycle added".to_string())
}

#[tauri::command]
pub fn load_journal(app: tauri::AppHandle) -> Result<ParseResult, String> {
    let path = journal_path(&app).map_err(|e| e.to_string())?;
    let result = crate::journal::load_journal(&path)?;
    Ok(result)
}
