import { useState} from "react";
import {Line} from "react-chartjs-2";
import {CircularProgress, createTheme, makeStyles, ThemeProvider,} from "@material-ui/core";
import SelectButton from "./SelectButton";
import {chartDays} from "../../config/data";
import {bistApi} from "../misc/BistApi";

const BistInfo = ({ comingBist }) => {
  const [hours, setHours] = useState(24);
  const [flag,setflag] = useState(true);
  let [bist, setBist] = useState(comingBist);

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 130,
      marginLeft: 30,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();

  const fetchBist =  async (h) => {
    const {data} = await bistApi.getBistWithHistory(bist.name, h);
    setBist(data);
    setflag(true);
  };

  // useEffect(() => {
  //     fetchBist(hours);
  // }, [hours]);



  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const isEnabledOrNot = (hour) => {
    const date = new Date().getDay();
    switch (date) {
      case 0:
      case 6:
      case 1:
        return hour === 24;
      case 2:
        return hour === 24 || hour === 48;
      case 3:
        return hour === 24 || hour === 48 || hour === 72;
      default:
        return true;
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        { flag===false ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: bist.values.map((bist) => {
                  let date = new Date(bist.date);
                  let time =
                      date.getHours() > 12
                          ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                          : `${date.getHours()}:${date.getMinutes()} AM`;
                  return hours === 24 ? time : date.toLocaleDateString();

                }),

                datasets: [
                  {
                    data: bist.values.map((bist) => bist.value),
                    label: `Price ( Past ${hours} Hours ) in TL`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                  isEnabledOrNot(day.value) &&
                  <SelectButton
                  key={day.value}
                  selected={day.value === hours}
                  onClick={() => {
                    setflag(false)
                    setHours(day.value);
                    fetchBist(day.value);
                  }}>
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default BistInfo;
