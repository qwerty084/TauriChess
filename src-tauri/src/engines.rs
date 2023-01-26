use serde::{Deserialize, Serialize};
use serde_json;
use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};

pub trait ChessEngine {
    fn new(id: u8, name: String, path: String) -> Self;
    fn write_engine(&self, path: &PathBuf) -> bool;
    fn read_engines(path: &PathBuf) -> Vec<Engine>;
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Engine {
    pub id: u8,
    pub name: String,
    pub path: String,
}

impl ChessEngine for Engine {
    fn new(id: u8, name: String, path: String) -> Engine {
        return Engine { id, name, path };
    }

    fn write_engine(&self, path: &PathBuf) -> bool {
        // create the file if it doesn't exists
        // let file_path = Path::new("/engines.json");
        let file_path = Path::new(path);

        if !file_path.exists() {
            let mut file = fs::File::create(file_path).expect("Error creating file");
            file.write_all(b"[]").unwrap();
        }

        // let json_str = std::fs::read_to_string("/engines.json").unwrap();
        let json_str = std::fs::read_to_string(path).unwrap();

        let mut json: serde_json::Value = serde_json::from_str(&json_str).unwrap();
        let engines = json.as_array_mut().unwrap();
        engines.push(serde_json::to_value(&self).unwrap());
        let new_json_str = serde_json::to_string(&json).unwrap();
        // std::fs::write("/engines.json", new_json_str).unwrap();
        std::fs::write(path, new_json_str).unwrap();

        return true;
    }

    fn read_engines(path: &PathBuf) -> Vec<Engine> {
        // let engines_json = std::fs::read_to_string("/engines.json").expect("Error reading file");
        let engines_json = std::fs::read_to_string(path).expect("Error reading file");

        let engines: Vec<Engine> = serde_json::from_str(&engines_json).expect("Error parsing json");
        return engines;
    }
}
