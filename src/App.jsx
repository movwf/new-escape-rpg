import React from 'react';
import './App.css';
import Map from './components/Map';
import Info from './components/Info';
import Logo from './components/Logo';
import Frame from './components/Frame';
import Footer from './components/Footer';
import Character from './components/Character';
import StartScreen from './components/StartScreen';
import Board from './components/Board';
import InteractionPrompt from './components/InteractionPrompt';

import { Maps } from './config/Maps';
import { PLAYER_HEIGHT, PLAYER_WIDTH } from './config/PlayerSettings';
import {
  createMapData,
  getStartPosition,
  isValidPosition,
} from './@core/utils/mapUtils';
import { loadSavedPositions, savePosition } from './utils/playerStorage';

const PLAYER_SIZE = { width: PLAYER_WIDTH, height: PLAYER_HEIGHT };
const AUTOSAVE_INTERVAL = 10000;
const EMPTY_BOARDS = [];

function App() {
  const [openSettings, setOpenSettings] = React.useState(true);
  const [selectedChar, setSelectedChar] = React.useState('char-1');
  const [selectedMap, setSelectedMap] = React.useState('map-1');
  const [nearbyBoard, setNearbyBoard] = React.useState(null);
  const [activeBoard, setActiveBoard] = React.useState(null);

  const mapData = React.useMemo(
    () => createMapData(Maps[selectedMap].data, Maps[selectedMap].pathLayerName),
    [selectedMap]
  );

  const boards = React.useMemo(
    () => Maps[selectedMap].boards ?? EMPTY_BOARDS,
    [selectedMap]
  );

  // Restore the last valid position for the selected map, otherwise use the
  // first walkable tile of the map.
  const startPos = React.useMemo(() => {
    const savedPositions = loadSavedPositions();
    const savedPosition = savedPositions[selectedMap];

    return isValidPosition(mapData, savedPosition, PLAYER_SIZE)
      ? savedPosition
      : getStartPosition(mapData);
  }, [mapData, selectedMap]);

  const latestPositionRef = React.useRef(startPos);

  const handlePositionChange = React.useCallback((position) => {
    latestPositionRef.current = position;
  }, []);

  const toggleSettings = React.useCallback(() => {
    setOpenSettings((isOpen) => !isOpen);
  }, []);

  const handleEscape = React.useCallback(() => {
    if (activeBoard) {
      setActiveBoard(null);
      return;
    }

    toggleSettings();
  }, [activeBoard, toggleSettings]);

  const handleInteract = React.useCallback(() => {
    if (activeBoard) {
      setActiveBoard(null);
      return;
    }

    if (nearbyBoard) {
      setActiveBoard(nearbyBoard);
    }
  }, [activeBoard, nearbyBoard]);

  const closeBoard = React.useCallback(() => {
    setActiveBoard(null);
  }, []);

  const handleSelectMap = React.useCallback((mapId) => {
    setActiveBoard(null);
    setNearbyBoard(null);
    setSelectedMap(mapId);
  }, []);

  // Autosave, plus a save when the map changes or the page is closed.
  React.useEffect(() => {
    latestPositionRef.current = startPos;

    const persistPosition = () => {
      savePosition(selectedMap, latestPositionRef.current);
    };

    const intervalId = window.setInterval(persistPosition, AUTOSAVE_INTERVAL);

    window.addEventListener('pagehide', persistPosition);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('pagehide', persistPosition);
      persistPosition();
    };
  }, [selectedMap, startPos]);

  const controlsEnabled = !openSettings && !activeBoard;

  return (
    <div className="App">
      <Logo />
      <div className="Game">
        <Frame>
          {openSettings && (
            <StartScreen
              {...{
                selectedMap,
                setSelectedMap: handleSelectMap,
                selectedChar,
                setSelectedChar,
                setOpenSettings,
              }}
            />
          )}
          <Map mapImage={Maps[selectedMap].image}>
            <Character
              key={selectedMap}
              startPos={startPos}
              pathLayerData={mapData}
              char={selectedChar}
              boards={boards}
              controlsEnabled={controlsEnabled}
              boardOpen={Boolean(activeBoard)}
              onInteract={handleInteract}
              onEscape={handleEscape}
              onPositionChange={handlePositionChange}
              onNearbyBoardChange={setNearbyBoard}
            />
            {nearbyBoard && controlsEnabled && <InteractionPrompt label="open board" />}
            {activeBoard && <Board board={activeBoard} onClose={closeBoard} />}
          </Map>
        </Frame>
        <Info />
      </div>
      <Footer />
    </div>
  );
}

export default App;
