use std::fs::File;

#[tauri::command]
pub async fn get_opening_for_pgn(input_pgn: String) -> Result<String, String> {
    let file = File::open("./data/openings.csv");
    let mut rdr = csv::Reader::from_reader(file.unwrap());
    for result in rdr.records() {
        let record = result.unwrap();
        let pgn = &record[2];
        if pgn == input_pgn {
            let name = &record[1];
            return Ok(name.to_string());
        }
    }

    Ok(("").to_string())
}
