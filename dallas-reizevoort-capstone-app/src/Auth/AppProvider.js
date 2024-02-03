import React, { useState, createContext } from 'react';

export const PlaylistContext = createContext();

const AppProvider = ({ children }) => {
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const [reset, setReset] = useState(false);

  const resetPlaylist = () => {
    setPlaylistCreated(false);
    setReset(true);
  };

  return (
    <PlaylistContext.Provider value={{ resetPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export default AppProvider;