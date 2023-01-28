use serde::{Deserialize, Serialize};
use serde_json;
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use uuid::Uuid;

pub trait ChessEngine {
    fn new(name: String, path: String) -> Self;
    fn write_engine(&self, path: &PathBuf) -> bool;
    fn edit_engine(path: &PathBuf, id: Uuid, new_engine: Engine) -> bool;
    fn read_engines(path: &PathBuf) -> Vec<Engine>;
    fn delete_engine(path: &PathBuf, id: Uuid) -> bool;
}

#[derive(Serialize, Deserialize)]
pub struct Engine {
    pub id: Uuid,
    pub name: String,
    pub path: String,
}

impl ChessEngine for Engine {
    fn new(name: String, path: String) -> Engine {
        let id = Uuid::new_v4();
        return Engine { id, name, path };
    }

    fn write_engine(&self, path: &PathBuf) -> bool {
        // create the file if it doesn't exists
        let file_path = Path::new(path);

        if !file_path.exists() {
            let mut file = fs::File::create(file_path).expect("Error creating file");
            file.write_all(b"[]").unwrap();
        }

        let json_str = std::fs::read_to_string(path).unwrap();

        let mut json: serde_json::Value = serde_json::from_str(&json_str).unwrap();
        let engines = json.as_array_mut().unwrap();
        engines.push(serde_json::to_value(&self).unwrap());
        let new_json_str = serde_json::to_string(&json).unwrap();
        std::fs::write(path, new_json_str).unwrap();

        return true;
    }

    fn edit_engine(path: &PathBuf, id: Uuid, new_engine: Engine) -> bool {
        // read the file
        let json_str = std::fs::read_to_string(path).unwrap();

        // parse the json
        let mut json: serde_json::Value = serde_json::from_str(&json_str).unwrap();
        let engines = json.as_array_mut().unwrap();

        // find the engine with the matching id
        for i in 0..engines.len() {
            let engine = &engines[i];
            let engine_id = Uuid::parse_str(engine["id"].as_str().unwrap()).unwrap();
            if engine_id == id {
                // update the engine
                let mut new_engine = serde_json::to_value(new_engine).unwrap();
                new_engine["id"] = serde_json::Value::String(id.to_string());
                engines[i] = new_engine;
                break;
            }
        }

        // write the json back to the file
        let new_json_str = serde_json::to_string(&json).unwrap();
        std::fs::write(path, new_json_str).unwrap();

        return true;
    }

    fn read_engines(path: &PathBuf) -> Vec<Engine> {
        if !path.exists() {
            let mut file = fs::File::create(path).expect("Error creating file");
            file.write_all(b"[]").unwrap();
        }
        let engines_json = std::fs::read_to_string(path).expect("Error reading file");
        let engines: Vec<Engine> = serde_json::from_str(&engines_json).expect("Error parsing json");

        return engines;
    }

    fn delete_engine(path: &PathBuf, id: Uuid) -> bool {
        // read the file
        let json_str = std::fs::read_to_string(path).unwrap();

        // parse the json
        let mut json: serde_json::Value = serde_json::from_str(&json_str).unwrap();
        let engines = json.as_array_mut().unwrap();

        // find the engine with the matching id and remove it
        let index_to_delete = engines.iter().position(|engine| {
            let engine_id = Uuid::parse_str(engine["id"].as_str().unwrap()).unwrap();
            engine_id == id
        });

        if let Some(index) = index_to_delete {
            engines.remove(index);
            // write the json back to the file
            let new_json_str = serde_json::to_string(&json).unwrap();
            std::fs::write(path, new_json_str).unwrap();
            return true;
        }
        return false;
    }
}
