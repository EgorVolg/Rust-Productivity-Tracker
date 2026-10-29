mod commands;
mod cycle;
mod filters;
mod journal;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::add_cycle,
            commands::load_journal,
            commands::delete_cycle,
            commands::edit_cycle,
            commands::load_filtered_journal,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
