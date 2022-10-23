import React, {useContext, useEffect, useState} from 'react'
import { useKeycloak } from '@react-keycloak/web'
import { NavLink, withRouter } from 'react-router-dom'
import { Container, Dropdown, Menu } from 'semantic-ui-react'
import { isAdmin } from './Helpers'
import {bistApi} from "./BistApi";
import {DataContext} from "./Balance";

function Navbar(props) {

  const { keycloak } = useKeycloak()
  const {balance} = useContext(DataContext)


  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      props.history.push('/')
      keycloak.logout()
    } else {
      keycloak.login()
    }
  }

  const fetchBalance = async () => {
    if(keycloak.authenticated) {
      await bistApi.getBalanceOnUser(keycloak.token).then((response) => {
        localStorage.setItem('balance', response.data)
      })
    }
  }

  useEffect(() => {
    fetchBalance().then()
  }, [])

  const checkAuthenticated = () => {
    if (!keycloak.authenticated) {
      handleLogInOut()
    }
  }

  const getUsername = () => {
    return keycloak.authenticated && keycloak.tokenParsed && keycloak.tokenParsed.preferred_username
  }

  const getLogInOutText = () => {
    return keycloak.authenticated ? "Logout" : "Login"
  }

  const getAdminMenuStyle = () => {
    return keycloak.authenticated && isAdmin(keycloak) ? { "display": "block" } : { "display": "none" }
  }

  const getUserLoggedInStyle = () => {
    return keycloak.authenticated ? { "display": "block" ,
        "float": "right",
        "color": "green",
        "margin-left": "10px",
        "margin-right": "10px",
    } : { "display": "none" }
  }

  return (
    <Menu stackable>
      <Container>
          <Menu.Item header>BIST Tracker
            <span style={getUserLoggedInStyle()}>
             💰 Balance: {balance ? balance : ""} ₺
            </span>
          </Menu.Item>
        <Menu.Item as={NavLink} exact to="/home">Home</Menu.Item>
        <Dropdown item text='Admin' style={getAdminMenuStyle()}>
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} exact to="/bists" onClick={checkAuthenticated}>Admin Panel</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Menu.Menu position='right'>
          {keycloak.authenticated &&
            <Dropdown text={`Hi ${getUsername()}`} pointing className='link item'>
              <Dropdown.Menu>
                {/*<Dropdown.Item as={NavLink} to="/settings">Settings</Dropdown.Item>*/}
                <Dropdown.Item as={NavLink} exact to="/user/shares" onClick={checkAuthenticated}>User Information</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          }
          <Menu.Item as={NavLink} exact to="/login" onClick={handleLogInOut}>{getLogInOutText()}</Menu.Item>
        </Menu.Menu>
      </Container>
    </Menu >
  )
}

export default withRouter(Navbar)