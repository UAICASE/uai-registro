var express = require('express');
var bodyParser = require('body-parser');
// mail Dependencies
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
// node variable
var dotenv  = require('dotenv').config();
var jsonQuery = require('json-query');


var query = require('array-query');	
// fileSystem
var jsonfile = require('jsonfile');

// Start Server
var app = express();
// var router = express.Router();
var port = process.env.PORT || 3000 ;
// Public path configuration
app.use(express.static(__dirname + '/App'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// Routes
app.post('/send', sendEmail);

app.post('/valid', valid);

app.get('/localization/:loc', projects);

function projects(req,res){
	var p = getProjects(req.params.loc.toLowerCase());
	res.end(JSON.stringify(p));
}

function valid(req, res) {
	var data = req.body;
		

	// var file = 'App/assets/data.json';
	
	var data = req.body,
		f = data.file;

	console.log(f);
	// var f = jsonfile.readFileSync('App/assets/data.json');
	var query = require('array-query');	
	var projects =  query.select(f).where("mail").equals(data.mail).end();
	
	console.log(projects);

	if (!projects) projects = [];
	
	res.end(JSON.stringify(projects));

};


function sendEmail(req, res) {
    
	var data = req.body;

	var transport = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
		    user: process.env.GmailUser,
		    pass: process.env.GmailPass
		}
	});
	

	

	
	var dest="";
	var projects="";
	
	data.items.forEach(function(i) {
	
	var p = getProject(i)
	dest +=	p.mail +";";
	projects += "- " + p.name +"<br/><br/>";
		
	});
	
		
	var bdy = "El alumno <br/><br/>Nombre: " + data.user.name +"<br/>Mail: " + data.user.mail +"<br/><br/> Se interesÃ³ en los siguientes proyectos: <br/><br/>" + projects;
	
	
	 var mailOptions = {
	    from: 'UAI <uai.case.registros@gmail.com>', 
	    to: dest,
		cc:"1carlos.neil@uai.edu.ar; 1medevincenzi@uai.edu.ar",
	    subject: "PRESENTACIÃ“N DE CÃ‰LULAS TECNOLÃ“GICAS EXTERNAS",
	    text: data.user.location + '-' + data.user.project,
		html: bdy
	};	
	
	 transport.sendMail(mailOptions, function(error, info){
	    
		if(error){
	        console.log(error);
	        res.json({yo: 'error'});
	    }else{
	        
	        logStudents(req.body);
	        res.redirect('/');
	    };
	});    
  
	
	
	
}

function getProject(id) {
	
		
	
	var data = jsonfile.readFileSync('App/assets/projects.json');
	
	//var project =  query.select(f.projects).where("id").equals(id).end();
	//var query = require('array-query');	
	//var project =  query("id").equals(JSON.stringify(id)).on(f.projects);
	//console.log(project);
			
	//return project;
	return jsonQuery('projects[id='+id+']', {data: data	}).value;

};


function getProjects(loc) {
	
	var f = jsonfile.readFileSync('App/assets/projects.json');
	
	
	var projects =  query.select(f.projects).where("localization").equals(loc).end();
		

return projects;

};




function logStudents(student) {

	var file = 'App/assets/data.json';
	var data = jsonfile.readFileSync(file);


	// console.log("user",student);

	
	var aux=[];
	
	student.items.forEach(function(i){
	
		var obj = { 
			project: i,
			mail: student.user.mail
		}

	
		aux.push(obj);
				 		
		
	
	if (aux) 		
		jsonfile.writeFileSync(file, data.concat(aux));
	
	


	});

};




// Start App
console.log('Starting App... \nlistening on port ' + port);
app.listen(port);