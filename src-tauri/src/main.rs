#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod openings_api;
mod puzzle_api;

use openings_api::get_opening_for_pgn;
use puzzle_api::get_puzzle;
use tauri_plugin_sql::TauriSql;

fn main() {
    tauri::Builder::default()
        .plugin(TauriSql::default())
        .invoke_handler(tauri::generate_handler![get_opening_for_pgn, get_puzzle])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
