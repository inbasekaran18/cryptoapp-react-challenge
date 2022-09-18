import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../data/api";
import { Line } from "react-chartjs-2";
import {
  LinearProgress,
  createTheme,
  makeStyles,
  ThemeProvider
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { ScriptableContext } from "chart.js";
import SelectButton from "./SelectButton";
import { chartDays } from "../data/buttonConst";
import { CryptoState } from "../CryptoContext";
const _ = require('lodash')
const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [fromDate, setFromDate] = useState('1W')
  const { currency } = CryptoState();
  const [flag, setflag] = useState(false);

  const useStyles = makeStyles((theme) => ({
    chart: {
      position: "relative",
    },
  }));

  const classes = useStyles();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(
      HistoricalChart(coin.id, fromDate, currency)
    )
    setflag(true);
    setHistoricData(_.orderBy(_.uniqBy(data.body,'unixTimestamp'), ['unixTimestamp'], 
             ['asc']))
  };

console.log(historicData)
  useEffect(() => {
    fetchHistoricData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate])

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
        fontFamily: "'Oxanium', cursive",
      },
      type: "dark",
    },
  });

  const data = () => {
    return {
      labels: historicData.map((coin) => {
        let date = new Date(coin.unixTimestamp)
        let time =
          date.getHours() > 12
            ? `${date.getHours() - 12}:${date.getMinutes()} PM`
            : `${date.getHours()}:${date.getMinutes()} AM`
        return fromDate === 1 ? time : date.toLocaleDateString()
      }),
      datasets: [
        {
          data: historicData.map((coin) => coin.price),
          label: `Price ( Past ${fromDate} Days ) in ${currency}`,
          fill: true,
          backgroundColor: (context: ScriptableContext<'line'>) => {
            const ctx = context.chart.ctx
            const gradient = ctx.createLinearGradient(0, 0, 0, 200)
            gradient.addColorStop(0, 'rgba(116,37,226,1)')
            gradient.addColorStop(1, 'rgba(231,231,231,0.4)')
            return gradient
          },
          borderColor: '#7425E2'
        }
      ]
    }
  }
  const options = {
    scales: {
      x: {
        ticks: {
          display: false,
        },

        // to remove the x-axis grid
        grid: {
         drawBorder: false,
display: false,
        },
      },
      y: {
        ticks: {
          display: false,
          //beginAtZero: true,
        },
        // to remove the y-axis grid
        grid: {
         drawBorder: false,
          display: false,
        },
      },
    },
    elements: {
      line: {
        radius: 1,
      },
    },
    //  plugins: {
    //    filler: {
    //      propagate: false
    //    }
    //  },
    //  interaction: {
    //    intersect: true
    //  }
  };

  return (
    <ThemeProvider>
      <div className={classes.chart}>
        {!historicData | (flag === false) ? (
          <LinearProgress
            style={{ color: '#7525E4' }}
            size={50}
            thickness={1}
          />
        ) : (
          <>
            <div
              style={{
                position: 'absolute',
                right: '0',
                top: '-104px'
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setFromDate(day.value)
                    setflag(false)
                  }}
                  selected={day.value === fromDate}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
            {historicData.length > 0 ? (
              <Line data={data()} options={options} />
            ) : (
              <Alert severity="warning">
                No Data Available for this Coin to show the graph
              </Alert>
            )}
          </>
        )}
      </div>
    </ThemeProvider>
  )
};

export default CoinInfo;
