import { Navbar, Nav, Container } from 'react-bootstrap';
import React, { useEffect, useState, useContext } from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import styled, { ThemeContext } from 'styled-components';
import endpoints from '../constants/endpoints';
import ThemeToggler from './ThemeToggler';
import Offcanvas from 'react-bootstrap/Offcanvas';
import routing from '../constants/index';

const styles = {
  logoStyle: {
    width: 50,
    height: 40,
  },
};

const ExternalNavLink = styled.a`
  color: ${(props) => props.theme.navbarTheme.linkColor};
  padding: 5px;
  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }
  &::after {
    background-color: ${(props) => props.theme.accentColor};
  }
`;

const InternalNavLink = styled(NavLink)`
  color: ${(props) => props.theme.navbarTheme.linkColor};
  padding: 5px;
  &:hover {
    color: ${(props) => props.theme.navbarTheme.linkHoverColor};
  }
  &::after {
    background-color: ${(props) => props.theme.accentColor};
  }
  &.navbar__link--active {
    color: ${(props) => props.theme.navbarTheme.linkActiveColor};
  }
`;

const NavBar = () => {
  require('matchmedia-polyfill');
  require('matchmedia-polyfill/matchMedia.addListener');

  const theme = useContext(ThemeContext);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(endpoints.navbar, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => err && setData(routing.navbar));
  }, []);

  return (
    <Navbar
      fixed="top"
      bg="dark"
      variant="dark"
      expanded={expanded}
      expand='sm' >
      <Container fluid>
        <Navbar.Brand onClick={() => setExpanded(false)}>
          <NavLink exact to='/'>
            <img
              src={data?.logo?.source}
              className="d-inline-block align-top"
              alt="main logo"
              style={
                data?.logo?.height && data?.logo?.width
                  ? { height: data?.logo?.height, width: data?.logo?.width }
                  : styles.logoStyle
              }
            />
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} onClick={() => setExpanded(!expanded)} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-sm`}
          aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
          placement="start"
          className='bg-dark'
        >
          <Offcanvas.Header onHide={() => setExpanded(false)} closeVariant='white' closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
              <Navbar.Brand onClick={() => setExpanded(false)} >
                <NavLink exact to='/'>
                  <img
                    src={data?.logo?.source}
                    className="d-inline-block align-top"
                    alt="main logo"
                    style={
                      data?.logo?.height && data?.logo?.width
                        ? { height: data?.logo?.height, width: data?.logo?.width }
                        : styles.logoStyle
                    }
                  />
                </NavLink>
              </Navbar.Brand>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav >
              {data
                && data.sections?.map((section, index) => (section?.type === 'link' ? (
                  <ExternalNavLink
                    key={section.title}
                    href={section.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setExpanded(false)}
                    className="navbar__link"
                    theme={theme}
                  >
                    {section.title}
                  </ExternalNavLink>
                ) : (
                  <InternalNavLink
                    key={section.title}
                    onClick={() => setExpanded(false)}
                    exact={index === 0}
                    activeClassName="navbar__link--active"
                    className="navbar__link"
                    to={section.href}
                    theme={theme}
                  >
                    {section.title}
                  </InternalNavLink>
                )))}
            </Nav>
            <ThemeToggler
              onClick={() => setExpanded(false)}
            />
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

const NavBarWithRouter = withRouter(NavBar);
export default NavBarWithRouter;
