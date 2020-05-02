import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles.css";
import Navbar from "./components/layout/Navbar";
//import UserItem from "./components/users/UserItem";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";

import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import axios from "axios";

const github = axios.create({
  baseURL: "https://api.github.com",
  timeout: 30000,
  headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN }
});

class App extends Component {
  state = {
    users: [],
    user: {},
    repos: [],
    loading: false,
    alert: null
  };

  //search git users
  searchUsers = async text => {
    this.setState({ loading: true });
    const res = await github.get(`/search/users?q=${text}`);
    this.setState({ users: res.data.items, loading: false });
  };

  getUser = async username => {
    this.setState({ loading: true });

    const res = await github.get(`/users/${username}?`);

    this.setState({ user: res.data, loading: false });
  };

  // Get users repos

  getUserRepos = async username => {
    this.setState({ loading: true });

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=$
      {
        process.env.REACT_APP_GITHUB_CLIENT_ID
       }&client_secret=${[process.env.REACT_APP_GITHUB_CLIENT_SECRET]}`
    );

    this.setState({ repos: res.data, loading: false });
  };

  //Clear users method from state
  clearUsers = () => this.setState({ users: [], loading: false });
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => this.setState({ alert: null }), 5000);
  };

  render() {
    const { users, loading, user, repos } = this.state;

    return (
      <Router>
        <div className="App">
          <Navbar nameHeader="Github Finder" />
          <div className="container">
            <Alert alert={this.state.alert} />
            <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <Fragment>
                    <Search
                      searchUsers={this.searchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0 ? true : false}
                      setAlert={this.setAlert}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                )}
              />
              <Route exact path="/about" component={About} />
              <Route
                exact
                path="/user/:login"
                render={props => (
                  <User
                    {...props}
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
                    repos={repos}
                    user={user}
                    loading={loading}
                  />
                )}
              />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
