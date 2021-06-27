import "./App.css";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";


const code = new URLSearchParams(window.location.search).get("code");
// console.log(code);

function App() {
  return  code ? <Dashboard code={code}/> : <Login />
}

export default App;
