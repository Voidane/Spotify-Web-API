import Login from './Login';
import DashLayout from './DashLayout';

const code = new URLSearchParams(window.location.search).get('code');

function App() {

  return (
    code ? 
        <DashLayout code={code}/>
        : 
        <Login />
  );
}

export default App;
