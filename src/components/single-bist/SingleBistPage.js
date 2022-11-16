import {Card, Input, LinearProgress, makeStyles, Typography} from "@material-ui/core";
import {useContext, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import ReactHtmlParser from "react-html-parser";
import BistInfo from "./BistInfo";
import {numberWithCommas} from "../homepage/BistTable";
import "react-awesome-button/dist/styles.css";
import {bistApi} from '../misc/BistApi'
import {Button, Grid} from "semantic-ui-react";
import {useKeycloak} from "@react-keycloak/web";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BistComments from "../comment/BistComments";
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

    function addInputOnVal(s) {
        document.getElementById('amount').value = s;
    }

    function getNotificationForValidation() {
        return (
            toast.error('Please enter a valid number ! 🙄', {
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

    function validationForAboveZero() {
        if (document.querySelector("#amount").value <= 0) {
            document.querySelector("#amount").value = 1;
            getNotificationForValidation();
            return false;
        }
        return true;
    }

    return (
        <div className={classes.container}>
            <Grid >
            <Grid.Row  columns={16}>
                <Grid.Column/>
                <Grid.Column width={5}>
                    <img
                        src={`/images/${bist?.name}.png` ? `/images/${bist?.name}.png` : '/images/default.png'}
                        alt={bist?.name}
                        height="200"
                        width="200"
                        style={{  marginLeft: 200, marginTop: 100, marginBottom: 50 }}
                    />
                    <Typography variant="h4" className={classes.heading}
                    style={{marginLeft : 150}}>
                        {bist?.name} ->  {bist.values[bist.values.length - 1].value+" TL"}
                    </Typography>
                </Grid.Column>
                <Grid.Column width={10}>
                    <BistInfo comingBist={bist} />
                </Grid.Column >
            </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={5}>
                    <Card style={
                        {
                            width: 300,
                            height: 200,
                            marginTop: -15,
                            marginLeft: 270,
                            backgroundColor: "#f5f5f5",
                            borderRadius: 10,
                            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                            border: "1px solid #e5e5e5",
                            padding: 10,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        }
                    }>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Button style={{ color: "green" ,
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #e5e5e5",
                                borderRadius: 10,
                                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                padding: 10,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",}} onClick={() => addInputOnVal(50)}>50</Button>
                            <Button style={{ color: "green" ,
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #e5e5e5",
                                borderRadius: 10,
                                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                padding: 10,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",}} onClick={() => addInputOnVal(100)}>100</Button>
                            <Button style={{ color: "green" ,
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #e5e5e5",
                                borderRadius: 10,
                                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                padding: 10,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",}} onClick={() => addInputOnVal(200)}>200</Button>
                            <Button style={{ color: "green" ,
                                backgroundColor: "#f5f5f5",
                                border: "1px solid #e5e5e5",
                                borderRadius: 10,
                                boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                                padding: 10,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",}} onClick={() => addInputOnVal(500)}>500</Button>
                        </div>
                        <Input type="number" id="amount" disabled={(!keycloak.authenticated)}
                        inputProps={{ min: "0", max: "10000", step: "1", style: { textAlign: "center" } }}
                               placeholder="Amount"/>
                        <Button
                            onClick={() => addPortfolio() && validationForAboveZero()}
                            disabled={(!keycloak.authenticated)}
                            style={{
                                backgroundColor: "gold", fontFamily: "Montserrat", fontSize: "15px", fontWeight: "bold"}}
                            type="primary">{keycloak.authenticated ?"Add My Portfolio": "Please First Login!"}
                        </Button>

                    </Card>
                    <ToastContainer />
                            </Grid.Column>
                    <Grid.Column width={10}>
                           <BistComments/>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={16}/>
                <Grid.Row columns={16}/>
            </Grid>
        </div>
    );
};

export default SingleBistPage;
