import React, { useState, useEffect } from 'react';
import { Avatar, Button, Tabs, useTheme, Popover, Link } from '@zeit-ui/react';
import makeStyles from 'components/makeStyles';
import { Sun, Moon } from '@zeit-ui/react-icons';

const useStyles = makeStyles((ui) => ({
  root: {
    borderBottom: `solid 1px ${ui.palette.accents_2}`,
    position: "fixed",
    width: "100%",
    zIndex: 100,
    backdropFilter: "saturate(180%) blur(5px)"
  },
  header: {
    width: ui.layout.pageWidthWithMargin,
    maxWidth: '100%',
    margin: '0 auto',
    backgroundColor: ui.type === "light" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
    fontSize: 16,
    height: 60,
    zIndex: 15,
  },
  headerContent: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `0 ${ui.layout.pageMargin}`,
  },
  headerTitle: {
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10
  },
  sidebar: {
    display: 'flex',
    alignItems: 'center !important'
  },
  themeIcon: {
    width: '40px !important',
    height: '40px !important',
    display: 'flex !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    marginRight: 5,
    padding: '0 !important'
  }
}));

const Menu = ({ toggleDarkMode }) => {
  const classes = useStyles();
  const theme = useTheme();
  const isDark = theme.type === 'dark';

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.headerContent}>
          <div style={{ display: 'flex' }}>
            <img src="images/cloudflare-icon.svg" />
            <div className={classes.headerTitle}>Cloudflare Diagnostics</div>
          </div>
          <div className={classes.sidebar}>
            <Button
              aria-label="Toggle Dark mode"
              className={classes.themeIcon}
              auto
              type="abort"
              onClick={toggleDarkMode}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;