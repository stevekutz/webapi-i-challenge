// implement your API here
const express  = require("express");
const db = require("./data/db.js");
const port = 4001;    // CHANGED  this !!!
const API = "/api/users";

const server = express();

server.use(express.json());   // DONT FORGET THIS !!!!!

// GET
server.get('/api/users/', (req, res) => {
    // db.find() returns a promise that resolves to a list of existing hubs
    db.find().then(userInfo => { 
        res.status(200).json(userInfo);    // introduce res.status() and res.json()
      }) 

      .catch(err => {
        res.status(500).json({      // use the catch-all 500 status code
          success: false,
          err: "The user information could not be retrieved.",
        });
      });
  });

// GET with specific ID
server.get("/api/users/:id", (req, res) => {
    db.findById(req.params.id).then(userInfo => {
        if(hub) {
            res.status(200).json ({
                success: true,
                hub
            })
        } else {
            res.status(404).json({
               success: false,
               message: "The user with the specific ID does not exist"     
            })
        }

    }).catch(err => {
        res.status(500).json({
            success: false,
            err: "The user information could not be retreived"
        })
    })
})




//POST
server.post("/api/users", (req, res) => {
    const userInfo = req.body;

    //  logic
    if(req.body.name && req.body.bio){
        db.insert(userInfo).then(info => {
            res.status(201).json({
                success: true,
                info
            });
        }).catch(err => {
            res.status(500).json({success: false, err})
        })
    } else {
        res.status(400).json({
            success: false,
            message: "Please provide name and bio for the user"
        })
    }
})

// DELETE
server.delete("/api/users/:id", (req, res) => {
  
    const { id } = req.params; 
    
    db.remove(id).then(deleted => {
      if (deleted) {
         // res.status(204).end(); 
         res.status(404).json({
             sucess: true,
             message: `we just removed user with id ${id} !!!! `   
         })   
      
      
        } else {
          res.status(500).json({
              success: false,
              message: "I cannot find the hub you are looking for",
          })
      }
    }).catch(error => {
        res.status(500).json({
            success: false, 
            error: "The user information could not be removed"});
    });
  });

// UPDATE
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;
    //  logic
    if(req.body.name && req.body.bio){
        db.update(id, changes).then(updated => {
            if (updated) {
                res.status(200).json({ success: true, updated})
            } else {
                res.status(404).json({
                    success: false,
                    message: "I cannot find the hub you are looking for!!!!"
                })
            }
        }).catch(error => {
            res.status(404).json({
                success: false, 
                error: "the user infomration could not be modified"});

        });

    } else {
        res.status(400).json({
            success: false,
            message: "Please provide name and bio for the user"
        });
    }




})



server.listen(port,() => {
    console.log(`\n Server running on http://localhost:${port} \n`);
});