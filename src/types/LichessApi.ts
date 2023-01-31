export interface LichessUser {
  id: string;
  username: string;
  perfs: {
    chess960?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    atomic?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    racingKings?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    ultraBullet?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    blitz?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    kingOfTheHill?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    bullet?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    correspondence?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    horde?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    puzzle?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    classical?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    rapid?: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
      prov: boolean;
    };
    storm?: {
      runs: number;
      score: number;
    };
  };
  createdAt: number;
  disabled?: boolean;
  tosViolation?: boolean;
  profile: {
    country: string;
    location: string;
    bio: string;
    firstName: string;
    lastName: string;
    fideRating: number;
    uscfRating: number;
    ecfRating: number;
    links: string;
  };
  seenAt: number;
  patron?: boolean;
  verified?: boolean;
  playTime: {
    total: number;
    tv: number;
  };
  title?: string;
  url: string;
  playing?: string;
  completionRate?: number;
  count: {
    all: number;
    rated: number;
    ai: number;
    draw: number;
    drawH: number;
    loss: number;
    lossH: number;
    win: number;
    winH: number;
    bookmark: number;
    playing: number;
    import: number;
    me: number;
  };
}
