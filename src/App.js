import React from "react";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import MovieContainer from "./Container/MovieContainer";
// import ReviewContainer from "./Container/ReviewContainer"

import Login from "./Components/Login";
import Nav from "./Components/Nav";
import Signup from "./Components/Signup";
import MyReviews from "./Components/MyReviews";

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
    currentMovie: {},
    view: false,

  };

  handleLogin = (token) => {
    this.setState({ logged_in: true, token });
  };

  getMovies = () => {
    fetch("http://localhost:3000/popularmovies")
      .then((r) => r.json())
      .then((json) => {
        this.setState({ movies: json.data });
      });

    
  };

  componentDidMount = () => {
    this.getMovies();

    const authToken = localStorage.getItem("token");
    if (authToken) {
      this.setState({ logged_in: true, token: authToken });
    }

  };

  viewMovie = (e, movie) => {
    e.stopPropagation()
    this.setState({
      currentMovie: movie,
      view: true
    });
  };

  render() {
    return (
      <div className="App">

        <Router>
          <Nav logged_in={this.state.logged_in} />
          <Switch>
            <Route exact path="/movies" component={() => <MovieContainer movies={this.state.movies} movieView={this.state.view} view={this.viewMovie} movie={this.state.currentMovie}  />} />

            <Route
              path="/myreviews"
              component={() => {
                return this.state.logged_in ? (
                  <MyReviews movies={this.state.movies} />
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
