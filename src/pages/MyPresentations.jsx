import { Container, Heading } from '@chakra-ui/react'
import React from 'react'
import { Layout } from '../components/Layout'
import AddTutorial from "../components/Presentation/AddPresentation";
import TutorialsList from "../components/Presentation/PresentationList";
import { Switch, Route, Link } from "react-router-dom";

export default function MyPresenationsPage() {
  return (
    <Layout>
      <Heading>My presenations</Heading>
      <Container maxW='container.lg' py={4}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/tutorials" className="navbar-brand">
            bezKoder
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/tutorials"} className="nav-link">
                Tutorials
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add"} className="nav-link">
                Add
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <h2>React Firebase Database CRUD</h2>
          <Switch>
            <Route exact path={["/", "/tutorials"]} component={TutorialsList} />
            <Route exact path="/add" component={AddTutorial} />
          </Switch>
        </div>
      </div>
      </Container>
    </Layout>
  )
}
