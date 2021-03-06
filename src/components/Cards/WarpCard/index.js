import React, { useState, useEffect } from 'react';
import { Button, Text, Link, Card, Dot, Tag, Tooltip, Row, Col, Loading, Description } from '@zeit-ui/react';
import makeStyles from 'components/makeStyles';
import { Zap, RefreshCcw, Server, Activity, Minimize2, Lock } from '@zeit-ui/react-icons';

const useStyles = makeStyles((ui) => ({
  card: {
    padding: '0 !important',
    marginBottom: `calc(${ui.layout.gap}*1.5) !important`
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& h3': {
      margin: 0
    },
    '& h6': {
      margin: 0,
      color: `${ui.palette.secondary} !important`
    }
  },
  dot: {
    display: 'flex !important',
    marginTop: ui.layout.gapQuarter,
    '& .label': {
      textTransform: 'none !important',
      display: 'flex',
      flex: 1,
      overflow: 'hidden'
    },
    '& .label a': {
      display: 'inline-block',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: 14,
      lineHeight: 'normal'
    },
    '& .link': {
      fontWeight: 500
    }
  },
  dotSuccess: {
    '& .icon': {
      backgroundColor: '#50e3c2 !important'
    },
  },
  footer: {
    display: 'flex !important',
    alignItems: 'center !important',
    height: 50,
    width: '100% !important'
  },
  info: {
    fontSize: 14,
    fontWeight: 500,
    marginBottom: "0",
    flexDirection: "row",
    display: "flex",
    cursor: "default",
    alignItems: "center",
    '& span': {
      margin: "0 4px"
    }
  },
  infoContainer: {
    margin: "12px 0"
  }
}));

const ProjectCard = ({ iata = [] }) => {
  const classes = useStyles();
  const host = "1.1.1.1";

  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [secureDNS, setSecureDNS] = useState([false, false, false]);

  const getSecureDNS = async () => {
    await Promise.allSettled(["cf"].map(e => fetch(`https://is-${e}.cloudflareresolve.com/resolvertest`))).then(e => {
      setSecureDNS(e.map(f => f.status === "fulfilled"));
    });
  }

  useEffect(() => {
    setLoading(true);
    fetch(`https://${host}/cdn-cgi/trace`).then(e => e.text()).then(e => {
      const m = e.split("\n").map(e => {
        if (e.trim() === "") return null;
        return e.split("=");
      });
      const result = {};
      m.forEach(e => {
        e && (result[e[0]] = e[1]);
      });
      return result;
    }).then(e => {
      Promise.allSettled([getSecureDNS()]).then(() => {
        setData(e);
        setLoading(false);
      });
    });
  }, [refresh]);

  return (
    <Card shadow className={classes.card}>
      <div className={classes.title}>
        <div>
          <Text h3>Warp Status</Text>
          <Text h6>
            <Dot type={loading ? "warning" : (data.warp === "off" ? "error" : "success")} className={`${classes.dot} ${!loading && data.warp !== "off" && classes.dotSuccess}`}>
              {loading ? "Testing" : `${(data.warp === "off" ? "Not " : "")}Connected`}
            </Dot>
          </Text>
        </div>
        <Tooltip text="Refresh">
          <Button className={classes.visitButton} size="small" auto onClick={() => setRefresh(e => !e)}>
            <RefreshCcw size={10} />
          </Button>
        </Tooltip>
      </div>
      <div className={classes.content}>
        <Row>
          <Col span={12}>
            <div className={classes.infoContainer}>
              <Description
                title="Using 1.1.1.1"
                content={loading ? <Loading size="small" /> : (secureDNS[0] ? "YES" : "NO")}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className={classes.infoContainer}>
              <Description
                title="Warp Version"
                content={loading ? <Loading size="small" /> : data.warp.toUpperCase()}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className={classes.infoContainer}>
              <Description
                title="True IP"
                content={loading ? <Loading size="small" /> : data.ip}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Card.Footer className={classes.footer}>
        <div className={classes.footer}>
          <Server size={14} />
          {!loading && (
            <Text className={classes.info}>{data.warp === "off" ? "Not Connected" : `${data.colo} - ${iata[data.colo] || "Unknown"}`}</Text>
          )}
          {loading && (
            <Loading size="small" />
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ProjectCard;