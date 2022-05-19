import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import ContactMailIcon from "@mui/icons-material/ContactMail";

import {ReactComponent as Uber} from './assets/uber.svg'
import {ReactComponent as Didi} from './assets/didi.svg'
import {ReactComponent as Cabify} from './assets/cabify.svg'
import {ReactComponent as Beat} from './assets/beat.svg'

function App() {
  const [optionsFrom, setOptionsFrom] = useState([]);
  const [optionsTo, setOptionsTo] = useState([]);
  const [from, setFrom] = useState("");
  const [open, setOpen] = useState(false);
  const [dataFound, setDataFound] = useState(false);
  const [prices, setPrices] = useState({});
  // const [prices, setPrices] = useState({didi:650, uber: 215, cabi:699, beat: 154});
  const [to, setTo] = useState("");
  const typingInterval = 1000;

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (from) {
        const { data } = await axios.get(
          `http://localhost:4500/autocomplete?query=${from}`
        );
        var options = [];
        for (let option of data) {
          options.push({ label: option.main_text, id: option.id });
        }
        setOptionsFrom(options);
      }
    }, typingInterval);

    return () => clearTimeout(delayDebounceFn);
  }, [from]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (to) {
        const { data } = await axios.get(
          `http://localhost:4500/autocomplete?query=${to}`
        );
        var options = [];
        for (let option of data) {
          options.push({ label: option.main_text, id: option.id });
        }
        setOptionsTo(options);
      }
    }, typingInterval);

    return () => clearTimeout(delayDebounceFn);
  }, [to]);

  const capitalizeFirst = (str) =>{
    return str[0].toUpperCase() + str.slice(1)
  }

  const Logo = (props) =>{
      if (props.option == 'uber') return <Uber/>
      if (props.option == 'didi') return <Didi/>
      if (props.option == 'beat') return <Beat/>
      if (props.option == 'cabi') return <Cabify/>
  }

  const handleClick = async () => {
    console.log({ from: optionsFrom[from], to: optionsTo[to] });
    if (!optionsFrom[from]?.id || !optionsTo[to]?.id) {
      setOpen(true);
      return;
    }
    try {
      let { data } = await axios.get(
        `http://localhost:4500/prices?from=${optionsFrom[from].id}&to=${optionsTo[to].id}`
      );
      let objSorted = {};

      Object.entries(data).forEach(function (item) {
        objSorted[item[0]] = item[1];
      });

      setPrices(objSorted);
      setDataFound(true);
    } catch (error) {
      setOpen(true);
    }
  };

  return (
    <div className="main-content flex">
      <Container className="main-container">
        <p className="main-p">A dónde vamoos?</p>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={optionsFrom}
          onInputChange={(e) => setFrom(e.target.value)}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Desde" />}
          />
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={optionsTo}
          onInputChange={(e) => setTo(e.target.value)}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Hasta" />}
          />
        <Button
          variant="outlined"
          className="btn"
          onClick={() => handleClick()}
          >
          Viajar
        </Button>

        <Modal
          open={dataFound}
          onClose={() => setDataFound(!dataFound)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              style={{ textAlign: "center" }}
              variant="h6"
              component="h6"
              >
              Los precios para ir de <i>{optionsFrom[from]?.label}</i> hasta{" "}
              <i>{optionsTo[to]?.label}</i> son:
            </Typography>
            <br />
            {Object.entries(prices)?.map((option, idx) => {
              return (
                <>
                  <Container
                    className={"rideOption " + option[0]}
                    >
                      {/* {
                        option[0] == 'didi' ? <Didi/> : option[0] == 'beat' ? <Beat/> : option[0] == 'uber' ? <Uber/> : <Cabify/> 
                      } */}
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      className="rideTitle"
                      >
                      {capitalizeFirst(option[0])}:{" "}
                    </Typography>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      className="rideTitle"
                    >
                      {option[0] == "uber" ? (
                        <i>
                          <u>Soon</u>
                        </i>
                      ) : (
                        '$'+ option[1].toFixed(0)
                      )}
                    </Typography>
                    {/* {idx == 1 && (
                      <Typography
                        style={{ margin: 0, padding: 0 }}
                        className="flex"
                      >
                        {" "}
                        <KeyboardArrowLeftIcon fontSize="medium" /> MAS BARATO{" "}
                      </Typography>
                    )} */}
                  </Container>
                </>
              );
            })}
          </Box>
        </Modal>
      </Container>
      {/* <iframe className="map-iframe" width="425" height="350" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-58.50957870483399%2C-34.57406950494744%2C-58.42924118041993%2C-34.52748334305017&amp;layer=mapnik"/> */}
      <Collapse
        in={open}
        style={{ zIndex: 9999, position: "absolute", bottom: 70 }}
      >
        <Alert
          severity="error"
          onClose={() => {
            setOpen(false);
          }}
        >
          Algo malió sal
        </Alert>
      </Collapse>
      <footer className="footer">
        <p className="footer-p">
          Derechos reservados por literlamente nadie robamos todo
        </p>
        <p className="footer-p">los reyes @2022</p>
      </footer>
    </div>
  );
}

export default App;
