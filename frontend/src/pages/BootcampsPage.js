import React, {useState, useEffect} from 'react';
import { 
    CircularProgress, 
    Container, 
    Grid, 
    makeStyles, 
    Paper, 
    Typography,
    Slider, 
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio} from "@material-ui/core";
import axios from "axios"
import { findByLabelText } from '@testing-library/react';
import BootcampCard from '../components/BootcampCard';
import { useHistory, useLocation } from "react-router-dom";

const useStyles = makeStyles({
    root: {
        marginTop: 20
    },
    loader: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    paper: {
        marginBottom: "1rem",
        padding: "13px"
    },
    filters: {
        padding: "0 1.5rem"
    },
    priceRangeInputs: {
        display: "flex",
        justifyContent: "space-between"
    }
})

const BootcampsPage = () => {

    const history = useHistory();
    const location = useLocation()

    let params = location.search ? location.search : null;

    const classes = useStyles();
    // State components
    const [bootcamps, setBootcamps] = useState([]);
    const [loading, setLoading] = useState(false);

    const [sliderMax, setsliderMax] = useState(1000);
    const [priceRange, setpriceRange] = useState([25, 75]);
    const [priceOrder, setPriceOrder] = useState("descending");

    const [filter, setFilter] = useState("");
    const [sorting, setSorting] = useState("");

  const  updateUiValues = (uiValues) => {
    setsliderMax(uiValues.maxPrice);

    if(uiValues.filtering.price) {
        let priceFilter = uiValues.filtering.price;

        setpriceRange([Number(priceFilter.gte), Number(priceFilter.lte)])
    }

    if(uiValues.sorting.price) {
        let priceSort = uiValues.sorting.price;
        console.log(priceSort);
        setPriceOrder(priceSort);
    }
  }

    // Side effects
    useEffect(() => {
        let cancel;
        setLoading(true);
        const fetchData = async() => {

            let query;
            if(params && !filter) {
                query = params;
            } else {
                query = filter;
            }

            console.log(query);

            if(sorting) {
                if(query.length === 0) {
                    query = `?sort=${sorting}`
                } else {
                    query = `query&sort=${sorting}`
                }
            }
            console.log(query);

            try {
                const {data} = await axios({
                    method: "GET",
                    url: `/api/bootcamp${query}`,
                    cancelToken: new axios.CancelToken((c) => cancel = c)
                });
                // console.log(data.uiValues);

                setBootcamps(data.data);
                setLoading(false);
                updateUiValues(data.uiValues);

            } catch (error) {
                console.log(error.response.data);
            }
           
        }
        fetchData();

        return () => cancel;
    }, [filter, params, sorting])

   
    const onHandleTextField = (e, type) => {
        let newRange;

        if(type === "lower") {
            newRange = [...priceRange]
            newRange[0] = Number(e.target.value);
            setpriceRange(newRange);
        }

        if(type === "upper") {
            newRange = [...priceRange]
            newRange[1] = Number(e.target.value)
            setpriceRange(newRange);
        }
    }

    const onTextFileldCommitHandler = () => {
        builtRangeFilter(priceRange);
    }

    const onSliderCommitHandler = (e, newValue) => {
        builtRangeFilter(newValue)
    }

    const  builtRangeFilter = (newValue) => {
        const urlFilter = `?price[gte]=${newValue[0]}&price[lte]=${newValue[1]}`;

        setFilter(urlFilter);
        history.push(urlFilter);
    }

    const handleSortChange = (e) => {
        setPriceOrder(e.target.value);

        if(e.target.value === "descending") {
            setSorting("-price")
        }
        else if(e.target.value === "ascending") {
            setSorting("price")
        }
    }

    return (
        <Container className={classes.root}>
            
            <Paper className={classes.paper}>
                <Grid item xs={12} sm={6}>
                    <Typography gutterBottotm>Filters</Typography>

                    <div className={classes.filters}>
                        <Slider 
                            min={0}
                            max={sliderMax}
                            value={priceRange}
                            disabled={loading}
                            valueLabelDisplay="auto"
                            onChange={(e, newValue)=> setpriceRange(newValue)}
                            onChangeCommitted={onSliderCommitHandler}
                        />
                        <div className={classes.priceRangeInputs}>
                            <TextField
                                size="small"
                                id="lower" 
                                label="Min Price"
                                variant="outlined"
                                type="number"
                                disabled={loading}
                                value={priceRange[0]}
                                onChange={(e) => onHandleTextField(e, "lower")}
                                onBlur={onTextFileldCommitHandler}
                            />
                            <TextField
                                size="small"
                                id="upper" 
                                label="Max Price"
                                variant="outlined"
                                type="number"
                                disabled={loading}
                                value={priceRange[1]}
                                onChange={(e) => onHandleTextField(e, "upper")}
                                onBlur={onTextFileldCommitHandler}
                            />
                        </div>
                    </div>

                    <Grid item xs={12} sm={6}>
                        <Typography gutterBottom>Sort By</Typography>

                        <FormControl component="fieldset" className={classes.filters}>
                            <RadioGroup
                                aria-label="price-order"
                                name="price-order"
                                value={priceOrder}
                                onChange={handleSortChange}
                            >
                                <FormControlLabel 
                                    value="descending"
                                    disabled={loading}
                                    control={<Radio />}
                                    label="price: highest - lowest"
                                />

                                <FormControlLabel 
                                    value="ascending"
                                    disabled={loading}
                                    control={<Radio />}
                                    label="price: lowest - highest"
                                />

                            </RadioGroup>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>


            {/* bootcamp listening */}
            <Grid container spacing={2}>
                {loading ? (
                    <div className={classes.loader}>
                        <CircularProgress size="3rem" thickness={5}/>
                    </div>
                    ) : (
                        bootcamps.map(bootcamp => (
                            <Grid item key={bootcamp._id} xs={12} sm={6} md={4} lg={3}>
                                <BootcampCard bootcamp={bootcamp}/>
                            </Grid>
                        ))
                    )
                }
            </Grid>
        </Container>
    )
}

export default BootcampsPage
