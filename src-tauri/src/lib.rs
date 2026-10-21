// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::Deserialize;

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

#[tauri::command]
fn add_cycle(cycle_form: CycleInput) -> String {
    println!("Cycle added: {:?}", cycle_form);
    "Cycle added".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![add_cycle])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
