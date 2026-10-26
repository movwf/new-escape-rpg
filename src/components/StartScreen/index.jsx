/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styles from './StartScreen.module.css';
import { Maps } from '../../config/Maps';
import { Characters } from '../../config/CharacterModels';

const CharacterOptions = React.memo(({ selectedChar, onSelect }) => (
  <div className={styles.characterOptionContainer}>
    {Object.keys(Characters).map((char) => (
      <div
        key={char}
        id={char}
        className={styles.characterOption}
        style={{
          backgroundImage: `url('${Characters[char].avatar}')`,
          outline: char === selectedChar ? '2px solid white' : undefined,
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(char);
        }}
      />
    ))}
  </div>
));

const MapOptions = React.memo(({ selectedMap, onSelect }) => (
  <div className={styles.mapOptionContainer}>
    {Object.keys(Maps).map((map) => (
      <div
        key={map}
        id={map}
        className={styles.mapOption}
        style={{
          backgroundImage: `url('${Maps[map].image}')`,
          outline: map === selectedMap ? '2px solid white' : undefined,
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(map);
        }}
      />
    ))}
  </div>
));

function StartScreen({
  selectedChar,
  setSelectedChar,
  selectedMap,
  setSelectedMap,
  setOpenSettings,
}) {
  const [toggleCharMenu, setToggleCharMenu] = React.useState(false);
  const [toggleMapMenu, setToggleMapMenu] = React.useState(false);

  return (
    <div className={styles.startScreen}>
      <span className={styles.characterSelectLabel}>Select Character</span>
      <div
        id="Characters"
        tabIndex="0"
        className={styles.characterSelect}
        onClick={() => {
          setToggleCharMenu((isOpen) => !isOpen);
          setToggleMapMenu(false);
        }}
      >
        <img src={Characters[selectedChar].avatar} alt={selectedChar} />
        <FaChevronDown className={styles.chevron} />
        {toggleCharMenu && (
          <CharacterOptions
            selectedChar={selectedChar}
            onSelect={(char) => {
              setSelectedChar(char);
              setToggleCharMenu(false);
            }}
          />
        )}
      </div>
      <br />
      <span className={styles.mapSelectLabel}>Select Map</span>
      <div
        id="Maps"
        tabIndex="0"
        className={styles.mapSelect}
        onClick={() => {
          setToggleMapMenu((isOpen) => !isOpen);
          setToggleCharMenu(false);
        }}
      >
        <img className={styles.selectedMapImage} src={Maps[selectedMap].image} alt={selectedMap} />
        <FaChevronDown className={styles.chevron} />
        {toggleMapMenu && (
          <MapOptions
            selectedMap={selectedMap}
            onSelect={(map) => {
              setSelectedMap(map);
              setToggleMapMenu(false);
            }}
          />
        )}
      </div>
      <br />
      <button
        type="button"
        className={styles.startButton}
        onClick={() => {
          setOpenSettings(false);
        }}
      >
        Start
      </button>
    </div>
  );
}

export default StartScreen;
