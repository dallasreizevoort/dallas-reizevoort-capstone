import './TrackSearchResult.scss';

function TrackSearchResult({ track, chooseTrack }) {
    function handlePlay() {
        chooseTrack(track);
    }
  return (
    <div className="track-search-result" onClick={handlePlay}>
      <img src={track.albumUrl} alt={track.title} />
      <div className="track-search-result__title">
        <div className="track-search-result__title">
          <h3>{track.title}</h3>
        </div>
        <div className="track-search-result__text">
          <p>{track.artist}</p>
        </div>
      </div>
    </div>
  );
}

export default TrackSearchResult;
