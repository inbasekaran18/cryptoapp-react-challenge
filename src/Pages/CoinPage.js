import { LinearProgress, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../data/api";
import { CryptoState } from "../CryptoContext";
import { FaCaretDown, FaCaretUp} from 'react-icons/fa'



const CoinPage = () => {
  const [coin, setCoin] = useState();

  const { currency, symbol } = CryptoState();

  const fetchCoin = async () => {
    const { data } = await axios.get(SingleCoin('bitcoin'))
    setCoin(data);
  };

  useEffect(() => {
    fetchCoin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useStyles = makeStyles((theme) => ({
    modal: {
      display: "flex",
      width: "900px",
      flexDirection: "column",
      background: "#fff",
      boxShadow: "5px 5px 20px rgba(34,9,69,0.2)",
      borderRadius: "24px",
      padding: "60px",
    },
    top: {
      width: "100%",
      paddingBottom: "60px",
    },
    heading: {
      fontWeight: "700",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
    bottommain: {
      width: "100%",
      textAlign: "justify",
      display: "flex",
      borderTop: "1px solid #dedede",
      alignItems: "center",
    },
    width1: {
      width: "33.333%",
      textAlign: "center",
      padding: "23px 35px",
      borderRight: "1px solid #dedede",
      "& span": {
        padding: "0px 0px 5px 0px",
        display: "block",
      },
    },
    width2: {
      width: "33.333%",
      textAlign: "center",
      padding: "23px 35px",
      "& span": {
        padding: "0px 0px 5px 0px",
        display: "block",
      },
    },
    red: {
      "& svg": {
        color: "red",
        fontSize: "16px",
      },
    },
  }));

  const classes = useStyles();

  if (!coin?.data) return <LinearProgress style={{ backgroundColor: 'gold' }} />

  return (
    <div className={classes.modal}>
      <div className={classes.top}>
        <div>
          <Typography>
            {coin?.data.name} ({coin?.data.symbol}){' '}
          </Typography>

          <div className={classes.marketData}>
            <span style={{ display: 'flex' }}>
              <Typography className={classes.heading} variant="h5">
                {symbol}
                {coin?.data.current_price}
              </Typography>
            </span>
            <span style={{ display: 'flex' }}>
              <Typography>Gain/loss 24hr:</Typography>
              &nbsp; &nbsp;
              <Typography style={{ color: 'green' }}>
                {symbol} {coin?.data.market_cap_change_percentage_24h} %
              </Typography>
            </span>
          </div>
        </div>
      </div>
      <CoinInfo coin={coin} />

      <div className={classes.bottommain}>
        <div className={classes.width1}>
          <span>Market Cap</span>
          <h4 className={classes.red}>
            {coin?.data.market_cap_change_percentage_24h > 0 ? (
              <FaCaretUp color="green" />
            ) : (
              <FaCaretDown color="red" />
            )}
            {coin?.data.market_cap}
          </h4>
        </div>

        <div className={classes.width1}>
          <span>Market Cap Rank</span>
          <h4>#{coin?.data.market_cap_rank}</h4>
        </div>

        <div className={classes.width2}>
          <span>24 hr Volume</span>
          <h4>{coin?.data.market_cap_change_24h}</h4>
        </div>
      </div>
    </div>
  )
};

export default CoinPage;
