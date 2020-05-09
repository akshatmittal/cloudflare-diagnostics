import React, { useState, useEffect } from 'react';
import { Input, Text } from '@zeit-ui/react';
import makeStyles from 'components/makeStyles';
import ConnectivityCard from 'components/Cards/ConnectivityCard';
import { Check } from '@zeit-ui/react-icons';

const useStyles = makeStyles((ui) => ({
  root: {
    backgroundColor: ui.palette.accents_1,
    borderBottom: `solid 1px ${ui.palette.accents_2}`
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
  container: {
    width: '100%'
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
  },
  singleHolder: {
    padding: `calc(${ui.layout.gap} / 3)`,
    width: "50%",
    display: "inline-block"
  },
  [`@media screen and (max-width: ${ui.layout.pageWidthWithMargin})`]: {
    singleHolder: {
      width: "100%"
    }
  },
  singleFull: {
    width: "100%"
  },
  inputCSS: {
    display: "block !important",
    margin: "0 auto",
    maxWidth: "400px",
    backgroundColor: ui.palette.background,
    ['& .input-wrapper']: {
      width: "100%"
    }
  }
}));

const Content = ({ iata }) => {
  const classes = useStyles();
  const [customHostname, setCustomHostname] = useState(null);
  const [commitedHostname, setCommitedHostname] = useState(null);

  const verifyHostname = () => {
    if ((customHostname || "").trim() === "") {
      return false;
    }
    const regex = new RegExp(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$/);
    if (regex.test(customHostname)) {
      setCommitedHostname(customHostname);
    } else {
      alert("Invalid hostname!");
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.row}>
          <div className={classes.container}>
            <div className={classes.singleHolder}>
              <ConnectivityCard
                name="Cloudflare Primary"
                host="1.1.1.1"
                iata={iata || []}
              />
            </div>
            <div className={classes.singleHolder}>
              <ConnectivityCard
                name="Cloudflare Business/Enterprise"
                host="cloudflare.com"
                iata={iata || []}
              />
            </div>
            <div className={classes.singleHolder}>
              <ConnectivityCard
                name="Cloudflare Pro"
                host="cdnjs.com"
                iata={iata || []}
              />
            </div>
            <div className={classes.singleHolder}>
              <ConnectivityCard
                name="Cloudflare Free"
                host="akshatmittal.com"
                iata={iata || []}
              />
            </div>
          </div>
          <div className={classes.container} style={{ marginTop: "32pt" }}>
            <Text h2 style={{ textAlign: "center" }}>Test My Site</Text>
            <div className={`${classes.singleHolder} ${classes.singleFull}`}>
              <Input
                clearable
                placeholder="Enter Hostname"
                width="100%"
                className={classes.inputCSS}
                iconRight={<Check />}
                iconClickable={true}
                onChange={e => setCustomHostname(e.target.value)}
                onIconClick={verifyHostname}
                onKeyUp={e => e.keyCode === 13 && verifyHostname()}
                onClearClick={e => setCommitedHostname(null)}
              />
            </div>
            {commitedHostname && (
              <div className={`${classes.singleHolder} ${classes.singleFull}`}>
                <ConnectivityCard
                  name="Custom Hostname"
                  host={commitedHostname}
                  iata={iata || []}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;