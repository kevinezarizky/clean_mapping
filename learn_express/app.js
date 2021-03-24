const express = require('express')
const app = express()
const port = 3000


//CODING KEPIN
const path = require("path")
const router = express.Router()
app.set("view engine", "pug");
app.set("views", path.join('D:/_Bank Indonesia/_CURRENT/learn_express/', "views"));

app.get('/', (req, res) => {
	res.render("index");
})

app.get("/about", (req, res) => {
	
	//Ubah Variable nu ieu
	var id = 'kevin_eza@bi.go.id'
	var nama = 'Kevin Eza Rizky'
	var group = 'DKEU'
	
	//Variable nu Ditampilkeun
	var message1 = 'User ID	: '+id;
	var message2 = 'Nama	: '+nama;
	var message3 = 'Group	: '+group;
	var akses_data = [];
	
	//Database Mapping
	var fs  = require("fs");
	var Data = fs.readFileSync('D:/_Bank Indonesia/_CURRENT/learn_express/views/database.txt').toString().split(';');
	var database = [];
	Data.forEach(element => console.log(element));
	Data.forEach(function(entry) {
		var temp = entry.split('-');
		console.log(temp);
		database.push([[temp[0]],[temp[1]]])
		}
	);
	console.log(database[0][0]);
	database.forEach(function(pembanding){
		if(group==pembanding[0]){
			akses_data.push(pembanding[1])
		}
	});
	
	//Panggil views
  res.render("about", { title: "Hey", message1: message1, message2: message2, message3: message3, data:akses_data  });
});

//END CODING KEPIN

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})