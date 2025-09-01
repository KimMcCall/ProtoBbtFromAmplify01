import { useNavigate } from 'react-router-dom';

const box: React.CSSProperties = {
  height: '60px',
  width: '1000px',
  border: '2px solid blue',
  padding: '4px',
  margin: '4px',
  backgroundColor: '#d0e0ff',
};

const spacer01: React.CSSProperties = {
  display: "inline-block",
  width: '700px',
};

function BannerBox() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div id="banner-box" style={box}>
      <button id="logo-button" onClick={goHome}>TruthSquad.com</button>
      <span id="spacer-1" style={spacer01}></span>
      <button id="loginOrProfile" onClick={goHome}>Log In</button>
    </div>
  );
}

export default BannerBox;
