import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import {bistApi} from "../misc/BistApi";

const Carousel = () => {
  const [trending, setTrending] = useState([]);

  const fetchShareOnBackEnd = async () => {
    const { data } = await bistApi.getBists();
    setTrending(data);
  };

  useEffect(() => {
    fetchShareOnBackEnd().then();
  }, []);

  const useStyles = makeStyles((theme) => ({
    carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
    },
    carouselItem: {
      width: 100,
      height: 200,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "black",
    },
  }));

  const classes = useStyles();

  const items = trending.map((bist) => {
    let profit = bist?.dailyChangePercentage >= 0;

    return (
      <Link className={classes.carouselItem} to={`/history/${bist.name}`}>
        <img
            src={`/images/${bist.name}.png` ? `/images/${bist.name}.png` : '/images/default.png'}
            alt={bist.name}
            height="80"
            style={{ marginBottom: 10 }}
        />
        <br/>
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {bist?.dailyChangePercentage}%
          </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
           {bist?.value + "₺" }
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </div>
  );
};

export default Carousel;
