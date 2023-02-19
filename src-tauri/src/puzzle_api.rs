use std::fs::File;

#[tauri::command]
pub async fn get_puzzle(puzzle_theme: String, puzzle_rating: u16) -> Result<String, String> {
    let file = match File::open("./data/lichess_puzzles.csv") {
        Ok(f) => f,
        Err(e) => return Err(e.to_string()),
    };
    let mut rdr = csv::ReaderBuilder::new().flexible(true).from_reader(file);

    let puzzle_min: u16 = puzzle_rating - 150;
    let puzzle_max: u16 = puzzle_rating + 150;

    while let Some(result) = rdr.records().next() {
        let record = result.unwrap();
        let themes = &record[7];

        if themes.contains(&puzzle_theme) {
            let rating: u16 = record[3].parse().unwrap();
            if rating > puzzle_min && rating < puzzle_max {
                return Ok(record[0].to_string());
            }
        }
    }

    Err("Puzzle not found".to_string())
}
