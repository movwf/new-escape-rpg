# New Escape RPG

A small tile-based movement game built with React and Vite. Pick a character and
a map, then move around the map while fences and walls block your path.

## Screenshots

![Run-Escape Game Screen](https://i.ibb.co/ZWJcZWD/run-escape.png)
![Settings Screen](https://i.ibb.co/yRCGR0y/run-escape2.png)

## Run the project

```bash
yarn
yarn dev
```

Other useful commands:

```bash
yarn build    # production build
yarn preview  # preview the production build
yarn lint     # run oxlint
```

## Controls

| Key | Action |
| --- | --- |
| Arrow keys | Move the character (hold two to move diagonally) |
| Space | Cycle speed: x1 -> x2 -> x4 -> x1 |
| E | Open/close a board when standing near one |
| Esc | Open/close the settings screen |

## How it works

- Maps are Tiled JSON files in `src/data/maps`.
- Collision comes from the map layer configured in `src/config/Maps.js`
  (`Fences` for `map-1`). A tile with value `0` is walkable; any other value
  blocks movement.
- The player has a 32x32 hitbox and moves one pixel at a time, so a boosted
  step can never pass through a wall.
- Notice boards are configured per map in `src/config/Maps.js`. When the
  player is close enough, a prompt appears and `E` opens the board.
- The last valid position is saved per map in `localStorage` and restored when
  you return to that map.
