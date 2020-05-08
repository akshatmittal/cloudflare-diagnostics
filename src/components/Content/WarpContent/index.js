import React, { useState, useEffect } from 'react';
// import { Text, Link } from '@zeit-ui/react';
import makeStyles from 'components/makeStyles';
import WarpCard from 'components/Cards/WarpCard';

const useStyles = makeStyles((ui) => ({
  root: {
    backgroundColor: ui.palette.accents_1,
    borderBottom: `solid 1px ${ui.palette.accents_2}`,
  },
  content: {
    width: ui.layout.pageWidthWithMargin,
    maxWidth: '100%',
    boxSizing: 'border-box',
    margin: '0 auto',
    padding: `0 ${ui.layout.pageMargin}`,
    transform: 'translateY(-35px)'
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    minWidth: 1,
    maxWidth: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch'
  },
  projects: {
    width: '100%',
    padding: `calc(${ui.layout.gap} / 3)`,
  },
  activity: {
    flex: 1
  },
  viewAll: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: ui.layout.gap,
    textAlign: 'center'
  },
  activityTitle: {
    fontWeight: 700,
    marginTop: ui.layout.gap,
    fontSize: 24,
    textAlign: 'center'
  }
}));

const Content = ({ iata }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.row}>
          <div className={classes.projects}>
            <WarpCard iata={iata} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;