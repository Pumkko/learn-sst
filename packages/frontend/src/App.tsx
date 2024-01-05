import { Navbar } from "react-bootstrap";
import { RouterOutlet } from "./Routes";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { signOut } from 'aws-amplify/auth'

function App() {

  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    await signOut();
    authContext.setIsAuthenticated(false);
  }

  if(authContext.isAuthenticating){
    return <>Loading the app</>
  }

  return (
    <div className="App container py-3">
      <Navbar collapseOnSelect bg="light" expand="md" className="mb-3 px-3">
        <LinkContainer to="/">
          <Navbar.Brand className="fw-bold text-muted">Scratch</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav activeKey={window.location.pathname}>
            {
              authContext.isAuthenticated ? (<Nav.Link onClick={handleLogout}>Logout</Nav.Link>) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link href="/signup">Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link href="/login">Login</Nav.Link>
                  </LinkContainer></>)
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar >
      <RouterOutlet />
    </div >
  );

}

export default App
