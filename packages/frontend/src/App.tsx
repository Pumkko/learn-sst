import { Navbar } from "react-bootstrap";
import { RouterOutlet } from "./Routes";

function App() {


  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
        <Navbar.Toggle />
      </Navbar>
      <RouterOutlet />
    </div>
  );

}

export default App
