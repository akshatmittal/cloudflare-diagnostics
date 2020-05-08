import React, { useState, useEffect } from 'react';
import { Button, Text, Link, Card, Dot, Tag, Tooltip, Row, Col, Loading, Description } from '@zeit-ui/react';
import makeStyles from 'components/makeStyles';
import { Zap, RefreshCcw, Server, Activity, Minimize2, Lock } from '@zeit-ui/react-icons';

const useStyles = makeStyles((ui) => ({
  card: {
    padding: '0 !important',
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

const ProjectCard = ({ name, host, iata = [] }) => {
  const classes = useStyles();

  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const getPings = async () => {
    await Promise.all([1, 2, 3].map(e => fetch(`https://${host}/cdn-cgi/trace?_=${e}`).then(e => e.text()))); // That .text() is only to delay it.
    const list = performance.getEntriesByType("resource").filter(e => e.name.includes(host));
    if (performance.getEntriesByType("resource").length > 200) {
      performance.clearResourceTimings();
    }
    return list.slice(Math.max(list.length - 3, 0)).map(k => (k.responseEnd - k.startTime).toFixed(2));
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
      getPings().then(timings => {
        e.timings = timings;
        setData(e);
        setLoading(false);
      });
    }).catch(e => {
      // No CF
      setData(false);
      setLoading(false);
    });
  }, [refresh, host]);

  return (
    <Card shadow className={classes.card}>
      <div className={classes.title}>
        <div>
          <Text h3>{name}</Text>
          <Text h6>
            <Dot type={loading ? "warning" : ((data || loading) ? "success" : "error")} className={`${classes.dot} ${!loading && data && classes.dotSuccess}`}>{host}</Dot>
          </Text>
        </div>
        <Tooltip text="Refresh">
          <Button className={classes.visitButton} size="small" auto onClick={() => setRefresh(e => !e)}>
            <RefreshCcw size={10} />
          </Button>
        </Tooltip>
      </div>
      {(data || loading) && (
        <div className={classes.content}>
          <Row>
            <Col span={8}>
              <div className={classes.infoContainer}>
                <Description
                  title="IP Version"
                  content={loading ? <Loading size="small" /> : `IPV${data.ip.indexOf(":") > -1 ? "6" : "4"}`}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className={classes.infoContainer}>
                <Description
                  title="HTTP Version"
                  content={loading ? <Loading size="small" /> : data.http.toUpperCase()}
                />
              </div>
            </Col>
            <Col span={8}>
              <div className={classes.infoContainer}>
                <Description
                  title="TLS Version"
                  content={loading ? <Loading size="small" /> : data.tls}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <div className={classes.infoContainer}>
                <Description
                  title="Last 3 Latencies (ms)"
                  content={loading ? <Loading size="small" /> : data.timings.join(", ")}
                />
              </div>
            </Col>
            <Col span={8}>
              <Row>
                <div className={classes.infoContainer}>
                  <Description
                    title="SNI Status"
                    content={loading ? <Loading size="small" /> : data.sni.toUpperCase()}
                  />
                </div>
              </Row>
            </Col>
          </Row>
        </div>
      )}
      {!(data || loading) && (
        <div className={classes.content}>
          <Text h4 style={{ marginTop: "16pt" }}>Cloudflare not detected.</Text>
        </div>
      )}
      <Card.Footer className={classes.footer}>
        <div className={classes.footer}>
          <Server size={14} />
          {!loading && (
            <Text className={classes.info}>{data?.colo || "No Data"} - {iata[data?.colo] || "Unknown"}</Text>
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