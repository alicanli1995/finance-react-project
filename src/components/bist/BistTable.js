import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper, Button
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import {bistApi} from "../misc/BistApi";
import {useKeycloak} from "@react-keycloak/web";
import { ToastContainer, toast } from 'react-toastify';
import SearchBar from "material-ui-search-bar";


export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



export default function BistTable() {
  const [bists, setBists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const {keycloak} = useKeycloak();
  const [allBists, setAllBists] = useState([]);
  const [favs, setFavs] = useState([]);
  let [myBist,setMyBist] = useState([]);

  const useStyles = makeStyles({
    row: {
      backgroundImage : "url(https://img.freepik.com/free-vector/gradient-white-monochrome-background_23-2149011361.jpg?w=2000)",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
      fontSize: "1.2rem",
      fontWeight: "italic",
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "black",
        fontFamily: "Montserrat",
        fontWeight: "bold",
      },
    },
  });

  const classes = useStyles();
  const history = useHistory();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const fetchBists = async () => {
    setLoading(true);
    const { data } = await bistApi.getBists();
    setBists(data);
    setAllBists(data);
    setLoading(false);
  };

  useEffect(async () => {
    fetchBists().then();
    if (keycloak.authenticated) {
      await bistApi.getFavs(keycloak.token).then(r => {
        setFavs(r.data.flatMap(f => f.name))
      });
    }
    await bistApi.getUserShares(keycloak.token).then(r => {
      setMyBist(r.data);
    });
  }, [] );

  const addFavorite = async (card, e) => {
    await bistApi.userFavAdd(card, keycloak.token).finally(() => {
      if (!isFav(card)) {
        setFavs([...favs, card]);
        e.target.innerText = "❤️";
        e.target.style.color = "red";
        getNotification("Added to Favorites");
      } else {
        setFavs(favs.filter((fav) => fav !== card));
        e.target.innerText = "♡️";
        e.target.style.color = "black";
        getNotification("Removed from Favorites");
      }
    });
  };

  const getNotification = (message) => {
    return (
        toast.success(`${message} 💯🏆🙌`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
    );
  }

    const getNotificationForLogin = (message) => {
        return (
            toast.error(`${message} 🤬🤬🤬`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        );
    }


  const handleSearch = () => {
    return bists.filter(
      (bist) =>
        bist.name.toLowerCase().includes(search) || bist.description.toLowerCase().includes(search)
    );
  };

  async function chartData(style) {
      if (style === "all") {
          setBists(allBists);
      } else if (style === "fav") {
          const filtered = allBists.filter((bist) => favs.includes(bist.name));
          setBists(filtered);
      } else if (style === "mybists") {
          if (keycloak.authenticated) {
            const filtered = allBists.filter((bist) => myBist.flatMap(f => f.name).includes(bist.name));
            setBists(filtered);
          }
      }
  }

  function isFav(name) {
    return favs.includes(name);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center", color:"black"}}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => chartData("all")}
          style={{ marginTop: "2.5rem", marginRight: "5rem" ,
            fontFamily: "Montserrat",
            fontSize: "1.2rem",
            backgroundColor: "#ffffff",
            color: "#000000",
            border: "1px solid white",
            borderRadius: "10px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
            All Bists
        </Button>

        <Button
            variant="contained"
            color="primary"
            onClick={() => keycloak.authenticated ? chartData("fav"): getNotificationForLogin("Please Login")}
            style={{ marginTop: "2.5rem",
              fontFamily: "Montserrat",
              fontSize: "1.2rem",
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "1px solid white",
              borderRadius: "10px",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
        >
           Favorites
        </Button>
          <Button
              variant="contained"
              color="primary"
              onClick={() => keycloak.authenticated ? chartData("mybists"): getNotificationForLogin("Please Login")}
              style={{ marginTop: "2.5rem", marginLeft: "5rem",
                  fontFamily: "Montserrat",
                  fontSize: "1.2rem",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "1px solid white",
                  borderRadius: "10px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
              }}
          >
              MY BISTS
          </Button>

          <SearchBar
              onCancelSearch={() => setSearch("")}
              placeholder={"Search Bists"}
              style={{width: "70%", marginTop: 30 ,marginBottom: 30 , outlineColor: "gold" , marginLeft: "15%",
                  background:"linear-gradient(to right, #232526, #414345)"
                  ,backgroundSize:"cover" , borderRadius : 50} }
              onChange={(e) => setSearch(e)}
          />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "ButtonHighlight"}}>
                <TableRow>
                  {["Name", "Price", "24h Change", "Total Volume","Favourite"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}

                      key={head}
                      align={
                        (head === "Name" || head === "Price" ? "left" : "center")
                      }
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.dailyChangePercentage > 0;
                    return (
                      <TableRow
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                            onClick={() => history.push(`/history/${row.name}`)}
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.poster}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 , height: 75, width: 75}}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                marginTop: 12,
                                color: "black",
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.name}
                            </span>
                            <span style={{ color: "black" }}>
                              {row.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="left" style={{color: "black",fontWeight: 1000,}}
                                   onClick={() => history.push(`/history/${row.name}`)}>
                            {numberWithCommas(row.value)}
                          {"₺"}{" "}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 1000,
                          }}
                        >
                          {profit && "+"}
                          {row.dailyChangePercentage}%
                        </TableCell>
                        <TableCell align="center" style={{color: "black",fontWeight: 1000,}}
                                   onClick={() => history.push(`/history/${row.name}`)}>
                          {numberWithCommas(Number(row.dailyVolume))} ₺
                        </TableCell>
                        <TableCell align={"center"} style={{
                            color: "black",
                            fontWeight: 1000,
                        }} >
                          <Button
                                onClick={(e) => keycloak.authenticated ? addFavorite(row.name,e) : getNotificationForLogin("Please Login")}
                                style={{
                                    color: isFav(row.name) ? "red" : "black",
                                    fontWeight: 1000,
                                    fontSize: 20
                                }}

                          > {isFav(row.name) ? "❤️" : "♡️"}</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Comes from @material-ui/lab */}
        <Pagination
          count={(handleSearch()?.length / 10).toFixed(0)}
          style={{
            color: "black",
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}
