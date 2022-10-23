import {Input, LinearProgress, makeStyles, Typography} from "@material-ui/core";
import {useContext, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import BistInfo from "./BistInfo";
import {numberWithCommas} from "./BistTable";
import "react-awesome-button/dist/styles.css";
import {bistApi} from '../misc/BistApi'
import {Button, Grid} from "semantic-ui-react";
import {useKeycloak} from "@react-keycloak/web";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BistComments from "./BistComments";
import {DataContext} from "../misc/Balance";

const SingleBistPage = () => {
    const { id } = useParams();
    const [bist, setBist] = useState();
    const { keycloak } = useKeycloak();
    const {setBalance} = useContext(DataContext)

    const fetchBist = async () => {
        const { data } = await bistApi.getBistWithHistory( id , 24);
        setBist(data);
    };

    useEffect(() => {
        fetchBist().then();
    }, []);


    const addPortfolio =  async () => {
        const data = {
            name: bist.name,
            amount: document.querySelector("#amount").value,
        }
        await bistApi.addShareUser(data, keycloak.token)
            .then(() => {
                document.querySelector("#amount").value = "";
            })
            .then(getNotification())
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                changeBalance();
            })
    }

    const changeBalance = async () => {
        await bistApi.getBalanceOnUser(keycloak.token).then((response) => {
                console.log(response.data)
                setBalance(response.data);
            }
        ).catch((error) => {
            console.log(error);
        })
    }

    const getNotification = () => {
        return (
            toast.success('Portfolio add success ! 💯🏆🙌', {
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




    const useStyles = makeStyles((theme) => ({
        container: {
            display: "flex",
            [theme.breakpoints.down("md")]: {
                flexDirection: "column",
                alignItems: "center",
            },
        },
        sidebar: {
            width: "30%",
            [theme.breakpoints.down("md")]: {
                width: "100%",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 25,
            borderRight: "2px solid grey",
        },
        heading: {
            fontWeight: "bold",
            marginBottom: 20,
            fontFamily: "Montserrat",
        },
        description: {
            width: "100%",
            fontFamily: "Montserrat",
            padding: 25,
            paddingBottom: 15,
            paddingTop: 0,
            textAlign: "justify",
        },
        marketData: {
            alignSelf: "start",
            padding: 25,
            paddingTop: 10,
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
    }));



    const classes = useStyles();

    if (!bist) return <LinearProgress style={{ backgroundColor: "gold" }} />;

    return (
        <div className={classes.container}>
            <Grid >
            <Grid.Row  columns={16}>
                <Grid.Column/>
                <Grid.Column width={5}>
                    <img
                        src={bist?.poster}
                        alt={bist?.name}
                        height="200"
                        width="200"
                        style={{  marginLeft: 200, marginTop: 50, marginBottom: 50 }}
                    />
                    <Typography variant="h4" className={classes.heading}
                    style={{marginLeft : 250}}>
                        {bist?.name}
                    </Typography>
                    <Typography  style={{marginLeft : 80}} variant="subtitle1" className={classes.description}>
                        {ReactHtmlParser(bist?.description)}.
                    </Typography>
                    <div className={classes.marketData}>
              <span style={{ display: "flex" }}>
                <Typography  style={{marginLeft : 80}} variant="h6" className={classes.heading}>
                  Rank:
                </Typography>
                  &nbsp; &nbsp;
                  <Typography
                      variant="h6"
                      style={{
                          fontFamily: "Montserrat",
                      }}
                  >
                  {bist?.rank}
                </Typography>
              </span>

                        <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}  style={{marginLeft : 80}}>
                  Current Price:
                </Typography>
                            &nbsp; &nbsp;
                            <Typography
                                variant="h6"
                                style={{
                                    fontFamily: "Montserrat",
                                }}
                            >
                  {bist.values[bist.values.length - 1].value+" TL"}
                </Typography>
              </span>
                        <span style={{ display: "flex" }}>
                <Typography variant="h6" className={classes.heading}  style={{marginLeft : 80}}>
                    Total Volume: &nbsp;
                </Typography>
                            <Typography
                                variant="h6"
                                style={{fontFamily: "Montserrat"}}>
                      {numberWithCommas(Number(bist.dailyVolume))} TL
                </Typography>

                    </span>
                        <Input type="number" id="amount" disabled={(!keycloak.authenticated)}
                        inputProps={{ min: "0", max: "10000", step: "1" }}
                        style={{color: "black" , width: "160px", height: "30px", marginLeft: 190}}
                               placeholder="Amount"/>
                        <Button
                            onClick={addPortfolio}
                            disabled={(!keycloak.authenticated)}
                            style={{marginLeft: 180, marginTop: 10,
                                backgroundColor: "gold", fontFamily: "Montserrat", fontSize: "15px", fontWeight: "bold"}}
                            type="primary">{keycloak.authenticated ?"Add My Portfolio": "Please First Login!"}
                        </Button>
                    </div>
                    </Grid.Column>
                    <Grid.Column width={10}>
                            <BistInfo comingBist={bist} />
                    </Grid.Column >
                    <ToastContainer />
                 </Grid.Row>

                <Grid.Row columns={16}>
                    <Grid.Column/>
                    <Grid.Column width={16}>
                    <BistComments />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={16}/>
                <Grid.Row columns={16}/>
            </Grid>
        </div>
    );
};

export default SingleBistPage;
