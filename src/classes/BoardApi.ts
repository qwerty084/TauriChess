import { invoke } from '@tauri-apps/api/tauri';

/**
 * class for communication between the board and rust backend
 */
export class BoardApi {
  public async getOpeningName(pgn: string) {
    return await invoke('get_opening_for_pgn', {
      inputPgn: pgn,
    });
  }
}
