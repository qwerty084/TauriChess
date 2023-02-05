export interface User {
  user: ChessUser | null;
}

export interface ChessUser {
  ['@id']: string;
  country: string;
  followers: number;
  is_streamer: boolean;
  joined: number;
  last_online: number;
  league: string;
  player_id: number;
  status: string;
  url: string;
  username: string;
  verified: boolean;
}

export interface ChessGame {
  black: Player;
  end_time: number;
  fen: string;
  initial_setup: string;
  pgn: string;
  rated: boolean;
  rules: string;
  tcn: string;
  time_class: string;
  time_control: string;
  url: string;
  uuid: string;
  white: Player;
}

interface Player {
  rating: number;
  result: string;
  '@id': string;
  username: string;
  uuid: string;
}
