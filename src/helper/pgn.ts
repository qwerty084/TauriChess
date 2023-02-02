export function pgnParser(pgn: string) {
  const pgnSplitted = pgn.split('1. ');
  const lines = pgnSplitted[0].split(']');
  const metadata = lines.reduce<Record<string, string | string[]>>(
    (acc, line) => {
      const [key, value] = line
        .trim()
        .replace('[', '')
        .split(/\s(.+)?/, 2);
      if (value) acc[key] = value.replace(/^"|"$/g, '');
      return acc;
    },
    {}
  );

  const moveString = pgn.slice(pgn.indexOf('1. ') + 1).slice(0, -2);
  const regex = /\{.*?clk.*?\}/g;
  const newMoves = moveString.replaceAll(regex, '');
  const regex2 = /\d+\./g;
  const newMoves2 = newMoves
    .replaceAll(regex2, '')
    .replaceAll('.', '')
    .replaceAll('\n', '');

  const moves = newMoves2.split(' ').filter((move) => move !== '');
  moves.pop();
  metadata['moves'] = moves;

  return metadata;
}
