import { makeStyles } from "@material-ui/core";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import CoinPage from "./Pages/CoinPage";

const useStyles = makeStyles(() => ({
  App: {
    backgroundImage: `url(${"assets/img/bg.png"})`,
    color: "#17341A",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Route path="/" component={CoinPage} exact />
      </div>
    </BrowserRouter>
  );
}

export default App;
