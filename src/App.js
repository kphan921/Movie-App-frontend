import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import MovieContainer from "./Container/MovieContainer";
import ReviewContainer from "./Container/ReviewContainer"

import Login from "./Components/Login";
import Nav from './Components/Nav'
import Home from './Components/Home'
import Signup from './Components/Signup'
import Profile from './Components/Profile'

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

class App extends React.Component {
  state = {
    logged_in: false,
    token: null,
    movies: [],
    reviews: []
  };

  handleLogin = (token) => {
    this.setState({ logged_in: true, token });
  };

  Backend Requests
  getMovies = () => {
    fetch("http://localhost:3000/trendingmovies")
      .then((r) => r.json())
      .then((data) => {
        // console.log(data.results)
        this.setState({ movies: data.results });
      });
  };

 getReviews = () => {
    fetch("http://localhost:3000/reviews")
    .then(r => r.json())
    .then(data => {
      console.log(data)
      this.setState({reviews: data})
    })
  }

  componentDidMount = () => {
    this.getMovies();
    this.getReviews()
  };

  render() {
    return (
      <div className="App">
        <MovieContainer movies={this.state.movies} />
        <ReviewContainer reviews={this.state.reviews} />

        <Router>
          <Nav logged_in={this.state.logged_in} />
          <Switch>
            <Route exact path="/" component={Home} />
            {/* <Route exact path="/movies" component={Home} /> */}

            <Route
              path="/profile"
              component={() => {
                return this.state.logged_in ? (
                  <Profile {...this.state} />
                ) : (
                  <Redirect to="/login" />
                );
              }}
            />

            <Route
              path="/login"
              component={() => <Login handleLogin={this.handleLogin} />}
            />

            <Route
              path="/signup"
              component={() => <Signup handleLogin={this.handleLogin} />}
            />

            <Route
              path="/logout"
              component={() => {
                localStorage.clear();
                this.setState({ logged_in: false, token: null });
                return <Redirect to="/" />;
              }}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
