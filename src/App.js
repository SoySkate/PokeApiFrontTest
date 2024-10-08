import "./App.css";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import FetchCategory from "./components/FetchCategory";
function App() {
 

  return (
    //el router es para las paginas /HOme, /about por ejemplo (((rutas))))
    <Router>
    <div className="App">
      {/* El Switch es para los components con rutas que no se renderizen de forma simultanea
      por ejemplo si no hay swicth pero hay compoenents quizas se renderizan ambos a la vez*/}
      <Routes>
        <Route path="/" element={<h1>Hola</h1>}/>
      <Route path="/category" element={<FetchCategory/>}/>
      </Routes>
    </div>
    </Router>
  );
}

export default App;
