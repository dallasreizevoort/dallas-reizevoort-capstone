import "./Header.scss";
import Settings from "../Settings/Settings";
import { Link } from 'react-router-dom';
import HeaderLogo from "../../assets/images/sound-waves.png";


function Header({ onCategorySelect}) {
  return (
    <div className="header">
      <div className="header__container">
        <img src={HeaderLogo} alt="logo" />
        <h1>Soundtrack Analyzer</h1>
      

      <ul className="header__nav">
      <Link to="/top-tracks" onClick={() => onCategorySelect('tracks')}>
        <li className="header__nav--list">Top Tracks</li>
        </Link>
        <Link to="/top-artists" onClick={() => onCategorySelect('artists')}>
        <li className="header__nav--list">Top Artists</li>
        </Link>
        <Link to="/top-genres" onClick={() => onCategorySelect('genres')}>
        <li className="header__nav--list">Top Genres</li>
        </Link>
        <Link to="/recently-played">
        <li className="header__nav--list">Recently Played</li>
        </Link>
        <li className="header__nav--list">Your Mood</li>
      </ul>
      </div>
      <div className="header__settings">
        <Settings />
    </div>
    </div>
  );
}

export default Header;
