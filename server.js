const express = require('express') // require the express package
const app = express() // initialize your express app instance
require('dotenv').config();
const axios = require('axios');
const cors = require('cors');

const PORT = process.env.PORT;
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Drink', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(cors()) 
//schema
const DrinkSchema = new mongoose.Schema({
    strDrink:String,
    strDrinkThumb:String
  });

// modale
const DrinkModeal = mongoose.model('Drink', DrinkSchema);

// Routes
app.get('/all', allData)
app.post('/addFav',addFav)
app.get('/fav', fav)
app.delete('/deleteFav', deleteFav)
app.put('/UpdatFav',UpdatFav)







//functions
function allData(req,res) {
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    axios.get(url).then(resalt=>{
        res.send(resalt.data.drinks);
    })
    
}
function addFav(req,res) {
    
    const{strDrink,strDrinkThumb}=req.body;
    const item =new DrinkModeal({
        strDrink:strDrink,
        strDrinkThumb:strDrinkThumb

    })
    item.save();
}

function fav(req,res) {
    DrinkModeal.find({},(err,data)=>{
        res.send(data);  
    })
       
}
function deleteFav(req,res) {
    const idx=req.query.idx;
    DrinkModeal.deleteOne({idx:idx},(err,data)=>{
        DrinkModeal.find({},(err,data)=>{
            res.send(data);
        }) 
    })  
}
function UpdatFav(req,res) {
    const{strDrink,strDrinkThumb,idx}=req.body;
    DrinkModeal.find({idx:idx},(err,data)=>{
data[0].strDrink=strDrink;
data[0].strDrinkThumb=strDrinkThumb;
data[0].save().then(()=>{
    DrinkModeal.find({},(err,data)=>{
        res.send(data);
    }) 

})


    }
    )

    
}




 
// a server endpoint 
app.get('/', // our endpoint name
 function (req, res) { // callback function of what we should do with our request
  res.send('Hello World') // our endpoint function response
})
 
app.listen(PORT,()=>console.log(`${PORT}`)) 