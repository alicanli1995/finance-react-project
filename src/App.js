import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Home from './components/home/Home'
import Navbar from './components/misc/Navbar'
import {makeStyles} from "@material-ui/core";
import "./components/home/App.css";
import Footer from './components/footer/Footer';
import PrivateRoute from "./components/misc/PrivateRoute";
import BistsPage from "./components/bist/BistPage";
import SingleBistPage from "./components/bist/SingleBistPage";
import UserSettings from "./components/settings/UserSettings";
import UserInformation from "./components/bist/UserInformation";

const useStyles = makeStyles(() => ({
  App: {
    backgroundImage : "url(https://wallpaper.dog/large/11032570.jpg)",
    backgroundSize: "cover",
    color: "black",
    marginTop: -15,
  }
}));

function App() {
  const classes = useStyles();

  return (
      <Router>
        <Navbar />
        <Switch>
          <div className={classes.App}>
            <Route path="/" component={Home} exact />
            <Route path="/home" component={Home} exact />
            <Route path="/history/:id" component={SingleBistPage} exact />
            <PrivateRoute path='/settings' component={UserSettings} />
            <PrivateRoute path='/user/shares' component={UserInformation} />
            <PrivateRoute path='/bists' component={BistsPage} />
          </div>
        </Switch>
        <Footer />
      </Router>
  )
}

export default App