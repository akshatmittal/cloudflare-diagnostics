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
    '& .icon': {
      backgroundColor: '#50e3c2'
    },
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
  const [reachability, setReachability] = useState([false, false, false, false]);
  const [secureDNS, setSecureDNS] = useState([false, false, false]);

  const getReachable = async () => {
    await Promise.allSettled(["4a", "4b", "6a", "6b"].map(e => fetch(`https://ipv${e}.cloudflare-dns.com/resolvertest`))).then(e => {
      setReachability(e.map(f => f.status === "fulfilled"));
    });
  }

  const getSecureDNS = async () => {
    await Promise.allSettled(["cf", "dot", "doh"].map(e => fetch(`https://is-${e}.cloudflareresolve.com/resolvertest`))).then(e => {
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
      Promise.allSettled([getReachable(), getSecureDNS()]).then(() => {
        setData(e);
        setLoading(false);
      });
    });
  }, [refresh]);

  return (
    <Card shadow className={classes.card}>
      <div className={classes.title}>
        <div>
          <Text h3>Cloudflare Warp</Text>
          <Text h6>
            <Dot type={loading ? "warning" : (data.warp === "off" ? "error" : "success")} className={classes.dot}>
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
          <Col span={7}>
            <div className={classes.infoContainer}>
              <Description
                title="Using 1.1.1.1"
                content={loading ? <Loading size="small" /> : (secureDNS[0] ? "Yes" : "No")}
              />
            </div>
          </Col>
          <Col span={9}>
            <div className={classes.infoContainer}>
              <Description
                title="OVER TLS/HTTPS"
                content={loading ? <Loading size="small" /> : `${(secureDNS[1] ? "Yes" : "No")} / ${(secureDNS[2] ? "Yes" : "No")}`}
              />
            </div>
          </Col>
          <Col span={8}>
            <div className={classes.infoContainer}>
              <Description
                title="True IP"
                content={loading ? <Loading size="small" /> : data.ip}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <div className={classes.infoContainer}>
              <Description
                title="IPV4 a"
                content={loading ? <Loading size="small" /> : (reachability[0] ? "OK" : "FAIL")}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className={classes.infoContainer}>
              <Description
                title="IPV4 b"
                content={loading ? <Loading size="small" /> : (reachability[1] ? "OK" : "FAIL")}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className={classes.infoContainer}>
              <Description
                title="IPV6 a"
                content={loading ? <Loading size="small" /> : (reachability[2] ? "OK" : "FAIL")}
              />
            </div>
          </Col>
          <Col span={6}>
            <div className={classes.infoContainer}>
              <Description
                title="IPV6 b"
                content={loading ? <Loading size="small" /> : (reachability[3] ? "OK" : "FAIL")}
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