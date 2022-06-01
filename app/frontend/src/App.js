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
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

function App() {
  const [optionsFrom, setOptionsFrom] = useState([]);
  const [optionsTo, setOptionsTo] = useState([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("");
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [dataFound, setDataFound] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [prices, setPrices] = useState({});
  // const [prices, setPrices] = useState({uber: 360, cabi:400, beat: 410, didi: 480});
  const typingInterval = 1000;
  // const base_url = "https://2a6f-200-16-122-134.ngrok.io"
  const base_url = "http://192.168.1.125:4500";

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
    return () => {
      let temp = JSON.parse(localStorage.getItem("favorites"));
      if (temp) {
        console.log(temp);
        setFavorites(temp);
      }
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (from) {
        setLoading(true);
        const { data } = await axios.get(
          `${base_url}/autocomplete?query=${from}`
        );
        var options = [];
        for (let option of data) {
          options.push({ label: option.main_text, id: option.id });
        }
        setOptionsFrom(options);
        setLoading(false)
      }
    }, typingInterval);

    return () => clearTimeout(delayDebounceFn);
  }, [from]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (to) {
        setLoading(true)
        const { data } = await axios.get(
          `${base_url}/autocomplete?query=${to}`
        );
        var options = [];
        for (let option of data) {
          options.push({ label: option.main_text, id: option.id });
        }
        setOptionsTo(options);
        setLoading(false)
      }
    }, typingInterval);

    return () => clearTimeout(delayDebounceFn);
  }, [to]);

  const capitalizeFirst = (str) => {
    return str[0].toUpperCase() + str.slice(1);
  };

  const handleClick = async (from, to) => {
    console.log(from, to);
    if (!from?.id || !to?.id) {
      setError("parametros incompletoss");
      setOpen(true);
      return;
    }
    try {
      setLoading(true)
      fetch(
        `${base_url}/prices?from=${from.id}&to=${to.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          let entries = Object.entries(data).sort(function (a, b) {
            return a[1] - b[1];
          });
          let final = {};
          for (let pos of entries) {
            final[pos[0]] = pos[1];
          }
          setPrices(final);
          setDataFound(true);
          setLoading(false)
        });
    } catch (error) {
      setError(String(error));
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        setError("");
      }, 2000);
    }
  };

  const isFavorite = (from, to) => {
    if (favorites?.length > 0) {
      for (let fav of favorites){
        if(fav?.from?.id == from?.id && fav?.to?.id == to?.id){
          return true;
        }
      }
      return false;
    }
    return false;
  }

  const handleFavoriteList = (from, to) => {
    let idx = 0;
    if (favorites[0]?.from?.id == from?.id && favorites[0]?.to?.id == to?.id){
      console.log("primer caso");
      let newFavorites = favorites.shift();
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return;
    }

    if(favorites.length > 0){
      for (let fav of favorites){
        if(!(fav?.from?.id == from?.id && fav?.to?.id == to?.id)){
          idx += 1
        }
        break
      }
    }

    if (idx != 0){
      let newFavorites = favorites?.splice(idx, 1)  
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return;
    }

    if(favorites.length > 0){
      let newFavorites = favorites;
      newFavorites.push([{from, to}]);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
    }
    else{
      setFavorites([{from, to}]);
      localStorage.setItem('favorites', JSON.stringify([{from, to}]))
    }
  }

  const handleFavorite = (favorite) => {
    setFavoritesOpen(false)
    setOptionsFrom([favorite.from])
    setOptionsTo([favorite.to])
    setFrom(0)
    setTo(0)
    handleClick(favorite.from, favorite.to)
  }
  
  return (
    <div className="main-content flex">
      <Container className="main-container">
        <Typography variant="h4" className="main-p">
          A dónde vamos 🏎️
        </Typography>
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
          onClick={() => handleClick(optionsFrom[from], optionsTo[to])}
        >
          {loading ? "..." : "Viajar"}
        </Button>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="favorites"
          onClick={() => setFavoritesOpen(true)}
        >
          Revisar favoritos
        </Typography>

        <Modal
          open={dataFound}
          onClose={() => setDataFound(!dataFound)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="modal">
            <Typography
              id="modal-modal-title"
              style={{ textAlign: "center" }}
              variant="h6"
              component="h6"
            >
              Los precios para ir
            </Typography>
            <Typography
              id="modal-modal-title"
              style={{ textAlign: "center" }}
              variant="h6"
              component="h6"
            >
              de{" "}
              <b>
                <i>{optionsFrom[from]?.label}</i>
              </b>{" "}
            </Typography>
            <Typography
              id="modal-modal-title"
              style={{ textAlign: "center" }}
              variant="h6"
              component="h6"
            >
              hasta{" "}
              <b>
                <i>{optionsTo[to]?.label}</i>
              </b>
              :
            </Typography>
            <br />
            {Object.entries(prices)?.map((option, idx) => {
              return (
                <>
                  <Container className="optionWrapper" key={Math.random()*9899}>
                    <Container className={"rideOption " + option[0]}>
                      {/* {
                        option[0] == 'didi' ? <Didi/> : option[0] == 'beat' ? <Beat/> : option[0] == 'uber' ? <Uber/> : <Cabify/> 
                      } */}
                      <img src={require(`./assets/${option[0]}.svg`)} />

                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className={"rideTitle company text-" + option[0]}
                      >
                        {capitalizeFirst(option[0])}:{" "}
                      </Typography>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        className={"rideTitle price text-" + option[0]}
                      >
                        {option[0] == "uber" ? (
                          <i>
                            <u>Soon</u>
                          </i>
                        ) : (
                          "$" + option[1].toFixed(0)
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
                  </Container>
                </>
              );
            })}
            <Container className="favoriteIcon" onClick={() => handleFavoriteList(optionsFrom[from], optionsTo[to])}>
            {isFavorite(optionsFrom[from], optionsTo[to]) ? <StarIcon style={{fontSize:'30px'}}/> :  <StarBorderIcon style={{fontSize:'30px'}}/>}

            </Container>
            <RestartAltIcon
              onClick={() => handleClick(optionsFrom[from], optionsTo[to])}
              className="restartBtn"
            />
          </Box>
        </Modal>
        <Modal
          open={favoritesOpen}
          onClose={() => setFavoritesOpen(!favoritesOpen)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="modal">
            <Typography
              id="modal-modal-title"
              style={{ textAlign: "center" }}
              variant="h6"
              component="h6"
            >
              Tus favoritos:
            </Typography>
            <br />
            {favorites?.length > 0 ? (
              favorites?.map((favorite) => {
                return (
                  <Container className="favoriteContainer"
                  onClick = {() => handleFavorite(favorite)}
                  >
                    <Typography>Desde: {favorite?.from?.label}</Typography>
  
                    <Typography>Hasta: {favorite?.to?.label}</Typography>
                  </Container>
              ) 
              }
            )) : (
              <Typography>No tenes favoritos todaviaa!</Typography>
            )}
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
          {error ?? "Algo malió sal"}
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
