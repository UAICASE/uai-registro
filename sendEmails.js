// mail Dependencies
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
// node variable
var dotenv  = require('dotenv').config();

var jsonfile = require('jsonfile');

function getRegistry(){
    var data = jsonfile.readFileSync('./App/assets/registry.json');
}

function readProjects(){
	return jsonfile.readFileSync('./App/assets/projects.json');
}

function sendEmail() {


	console.log(process.env.GmailUser)
	console.log(process.env.GmailPass)

	var transport = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
		    user: process.env.GmailUser,
		    pass: process.env.GmailPass
		}
	});
	
		
	var bdy = "El alumno <br/><br/>Nombre: " + data.user.name +"<br/>Mail: " + data.user.mail +"<br/><br/> Se interesÃ³ en los siguientes proyectos: <br/><br/>" + projects;
	
	
	 var mailOptions = {
	    from: 'UAI <uai.case.info@gmail.com>', 
	    to: dest,
		cc:"1carlos.neil@uai.edu.ar; 1medevincenzi@uai.edu.ar",
	    subject: "PRESENTACIÃ“N DE CÃ‰LULAS TECNOLÃ“GICAS EXTERNAS",
	    text: data.user.location + '-' + data.user.project,
		html: bdy
	};	
	
	 transport.sendMail(mailOptions, function(error, info){
	    
		if(error){
	        console.log(error);
	    }else{
			console.log(info)
	    };
	});    
  
	
	
	
}


console.log(readProjects())