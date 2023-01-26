#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use engines::{ChessEngine, Engine};

mod engines;

const RESOURCE_PATH: &str = "engines.json";

#[tauri::command]
async fn add_engine(handle: tauri::AppHandle, name: &str, path: &str) -> Result<Engine, ()> {
    let engine: engines::Engine =
        engines::ChessEngine::new(1, String::from(name), String::from(path));

    let resource_path = handle
        .path_resolver()
        .resolve_resource(RESOURCE_PATH)
        .expect("failed to resolve resource");

    engine.write_engine(&resource_path);

    return Ok(engine);
}

#[tauri::command]
async fn get_engines(handle: tauri::AppHandle) -> Vec<Engine> {
    let resource_path = handle
        .path_resolver()
        .resolve_resource(RESOURCE_PATH)
        .expect("failed to resolve resource");
    return engines::Engine::read_engines(&resource_path);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![add_engine, get_engines])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
