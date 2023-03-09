const express = require("express");
const app = express();
const fs = require("fs");

//this is how we use middleware 
app.use(express.json());

// app.get('/', (req,res)=>{
//     res.status(200)
//     .json({message: 'hello from the server side !!',app: 'natours'});
// });


// app.post('/', (req,res)=>{
//     res.end("this is post endpoint");
// });


//top-level code,sync,blocking code
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
    );


//route handler
//get method
app.get('/api/v1/tours/:id?',(req,res)=>{

// finding particular thing in id by requesting parameters
console.log(req.params);

//convert parameter string into number
const id = req.params.id*1;

//find id by find array method in tours 
const tour = tours.find(el =>el.id=== id);

//if id is not in database
//if(!tour)
if( id > tours.length){
    return res.status(404).json({
        status:'fail',
        message:'Invalid ID'
    });
};

//if id is found in databse
    res.status(200).json({
        status:'success',
        data:{
            tour
        }
    });
});


//post method
app.post('/api/v1/tours',(req,res)=>{
    // console.log(req.body);

    //assigning id and if added then adding them into array
    const newId = tours[tours.length-1].id+1;
    const newTour = Object.assign({id:newId},req.body);

    //if new tours are added then write them in our tours file
    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err=>{
        res.status(201).json({
            status: "success",
            data:{
                tour :newTour
            }
        }).send();
    })


    // res.send('done');

});

//patch method (updates only the properties that user updated)
app.patch('/api/v1/tours/:id',(req,res)=>{
    if( req.params.id*1 > tours.length){
        return res.status(404).json({
            status:'fail',
            message:'Invalid ID'
        });
    }
    res.status(200).json({
        status:"success",
        data:{
            tour:'<updated tour>'
        }
    })
})

//app server
const port = 3000;
app.listen(port , ()=>{
    console.log("app running on port 3000");
});