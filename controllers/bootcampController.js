const Bootcamp = require('../models/model');
const asyncHandler = require('../middlewares/asyncHandler');
const errorResponse = require('../utils/errorResponse');

exports.getAllBootcamp = asyncHandler ( async (req, res, next) => {

    let query;

    let uiValues = {
        filtering: {},
        sorting: {}
    }

    const reqQuery = { ...req.query };
    // console.log(reqQuery);

    const removeFields = ["sort"]

    removeFields.forEach(params => delete reqQuery[params]);

    let queryString = JSON.stringify(reqQuery);

    queryString = queryString.replace(/\b(gte|lt|lte|gt|in)\b/g, (match) => `$${match}`);

    const filterKeys = Object.keys(reqQuery);
    // console.log(filterKeys);
    const filterValues = Object.values(reqQuery);
    // console.log(filterValues);

    filterKeys.forEach((val, idx) =>  uiValues.filtering[val] = filterValues[idx] );


    query = Bootcamp.find(JSON.parse(queryString));

    if(req.query.sort) {
        const sortByArray = req.query.sort.split(',');

        sortByArray.forEach(val => {
            let order;

            if(val === "-") {
                order = "descending";
            } else {
                order = "ascending";
            }

            uiValues.sorting[val.replace("-", "")] = order;
        })

        const sortByStr = sortByArray.join(' ');

        query = query.sort(sortByStr);
    } else {
        query = query.sort('-price');
    }

    const maxPrice = await Bootcamp.find().sort({price: -1}).limit(1).select("-_id price");
    const minPrice = await Bootcamp.find().sort({price: 1}).limit(1).select("-_id price");
    // console.log(maxPrice);
    // console.log(minPrice);

    uiValues.maxPrice = maxPrice[0];
    uiValues.minPrice = minPrice[0];

    const bootcamp = await query;


    res.status(201).json({
        suuceess: true,
        data: bootcamp,
        uiValues
    })
})

exports.createNewBootcamp = asyncHandler ( async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

exports.updateBootcamp = asyncHandler ( async (req, res, next) => {

    const id = req.params.id;
    let bootcamp = await Bootcamp.findById(id);

    if(!bootcamp) {
        return next(
            new errorResponse(`Bootcamp with id ${id} was not found`, 404)
        )
    }

    bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})

    res.status(201).json({
        success: true,
        data: bootcamp
    })
})

exports.deleteBootcamp = asyncHandler ( async (req, res, next) => {

    const id = req.params.id;
    let bootcamp = await Bootcamp.findById(id);

    if(!bootcamp) {
        return next(
            new errorResponse(`Bootcamp with id ${id} was not found`, 404)
        )
    }

   await bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
})


