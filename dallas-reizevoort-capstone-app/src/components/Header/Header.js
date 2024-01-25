import "./Header.scss";
import Settings from "../Settings/Settings";
import HeaderLogo from '../../assets/images/sound-bars-pulse-white.svg';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <div className="header">
      <div className="header__container">
        <img src={HeaderLogo} alt="logo" />
        <h1>Soundtrack Analyzer</h1>
      

      <ul className="header__nav">
      <Link to="/top-tracks">
        <li className="header__nav--list">Top Tracks</li>
        </Link>
        <Link to="/top-artists">
        <li className="header__nav--list">Top Artists</li>
        </Link>
        <li className="header__nav--list">Top Genres</li>
        <li className="header__nav--list">Recently Played</li>
      </ul>
      </div>
      <div className="header__settings">
        <Settings />
    </div>
    </div>
  );
}

export default Header;
