#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use engines::{ChessEngine, Engine};
use uuid::Uuid;

mod engines;

const RESOURCE_PATH: &str = "engines.json";

#[tauri::command]
async fn add_engine(handle: tauri::AppHandle, name: &str, path: &str) -> Result<bool, ()> {
    let engine: engines::Engine = engines::ChessEngine::new(String::from(name), String::from(path));

    let resource_path = handle
        .path_resolver()
        .resolve_resource(RESOURCE_PATH)
        .expect("failed to resolve resource");

    engine.write_engine(&resource_path);

    return Ok(true);
}

#[tauri::command]
async fn get_engines(handle: tauri::AppHandle) -> Vec<Engine> {
    let resource_path = handle
        .path_resolver()
        .resolve_resource(RESOURCE_PATH)
        .expect("failed to resolve resource");
    return engines::Engine::read_engines(&resource_path);
}

#[tauri::command]
async fn edit_engine(
    handle: tauri::AppHandle,
    id: Uuid,
    name: &str,
    path: &str,
) -> Result<bool, ()> {
    let resource_path = handle
        .path_resolver()
        .resolve_resource(RESOURCE_PATH)
        .expect("failed to resolve resource");

    let new_engine: engines::Engine =
        engines::ChessEngine::new(String::from(name), String::from(path));

    engines::Engine::edit_engine(&resource_path, id, new_engine);

    return Ok(true);
}

#[tauri::command]
async fn delete_engine(handle: tauri::AppHandle, id: Uuid) -> Result<bool, ()> {
    let resource_path = handle
        .path_resolver()
        .resolve_resource(RESOURCE_PATH)
        .expect("failed to resolve resource");

    let result = engines::Engine::delete_engine(&resource_path, id);

    return Ok(result);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            add_engine,
            get_engines,
            edit_engine,
            delete_engine
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
