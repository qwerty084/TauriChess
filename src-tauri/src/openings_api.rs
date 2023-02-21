use csv::ReaderBuilder;
use std::fs::File;

#[tauri::command]
pub async fn get_opening(input_pgn: String) -> Result<String, String> {
    let file = File::open("./data/openings.tsv").map_err(|_| "Error opening file")?;
    let mut reader = ReaderBuilder::new().delimiter(b'\t').from_reader(file);

    for result in reader.records() {
        let record = result.map_err(|_| "Error reading record")?;
        let pgn = &record[2];
        if pgn == &input_pgn {
            let name = &record[1];
            return Ok(name.to_string());
        }
    }

    Err("No opening found".to_string())
}
