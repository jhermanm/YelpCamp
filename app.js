const express = require('express');
const app = express();
const methodOverride = require("method-override")
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

const Campground = require('./models/campground');


const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');
const { findByIdAndUpdate } = require('./models/campground');
mongoose.connect('mongodb://localhost:27017/yelpCamp',
{useNewUrlParser: true})
.then(() =>{
    console.log("Connected.")
})
.catch((err) => {
    console.log("Failed to connect");
    console.log(err);
})

app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/campgrounds', async(req,res)=>{
   const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
})

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
})
app.post('/campgrounds', async(req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(302, `/campgrounds/${campground._id}`);
})
app.get('/campgrounds/:id', async(req, res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
})

app.get('/campgrounds/:id/edit', async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit',{campground});
})
app.put('/campgrounds/:id',async (req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id, {...req.body.campground});
    res.redirect(302,`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.listen(3000, () =>{
    console.log("Listening on Port 3000!");
})