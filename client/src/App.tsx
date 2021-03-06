import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditContact } from './components/EditContact'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Contacts } from './components/Contacts'
import { CreateContact } from './components/CreateContact'
import { MyContacts } from './components/MyContact'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleMyContacts() {
    this.props.history.push(`/contacts/me`)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">My Contacts Home</Link>
        </Menu.Item>
        <Menu.Item name="myContacts">
          <Link to="/contacts/me">Edit My Contacts</Link>
        </Menu.Item>
        <Menu.Item name="createNewCon">
          <Link to="/contacts/Create">Add New Contact</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }
  // `/contacts/create
  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={(props) => {
            return <Contacts {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/contacts/create"
          exact
          render={(props) => {
            return <CreateContact {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/contacts/me"
          exact
          render={(props) => {
            return <MyContacts {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/contacts/:contactId/edit"
          exact
          render={(props) => {
            return <EditContact {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
