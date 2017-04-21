// mail Dependencies
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
// node variable
var dotenv  = require('dotenv').config();

var count = 0;

var jsonfile = require('jsonfile');

var getRegistry = function(){
    return jsonfile.readFileSync('./App/assets/registry.json');
}

var GetProyect = function(key, dat){
	var jsonFile = jsonfile.readFileSync('./App/assets/projects.json');


	var proj = jsonFile.projects.filter((item) => item.id == key)
	sendEmail(proj[0], dat.user)
}

var sendEmail = function(proj, user) {

	var transport = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
		    user: process.env.GmailUser,
		    pass: process.env.GmailPass
		}
	});
	
		
	var bdy = "El alumno <br/><br/>Nombre: " + user.name +"<br/>Mail: " + user.mail +"<br/><br/> Se interesó en : <br/><br/>" + proj.name;
	
	
	 var mailOptions = {
	    from: 'UAI <uai.case.info@gmail.com>', 
	    to: proj.mail,
		// to: 'manuel@bitflowlabs.com',
		cc:"carlos.neil@uai.edu.ar; medevincenzi@uai.edu.ar",
	    subject: "PRESENTACIÓN DE CÉLULAS TECNOLÓGICAS EXTERNAS",
	    text: user.localization + '-' + proj.name,
		html: bdy
	};	

	let miPrimeraPromise = new Promise((resolve, reject) => {
			 transport.sendMail(mailOptions, function(error, info){
	    
				if(error){
					console.log(error);
				}else{
					count = count + 1
					console.log({ text: "SUCCESS", payload : info, Count : count });
					resolve(info)
				};
			});    
		});

	miPrimeraPromise.then((successMessage) => {
		console.log("GOOD")
	});
	
	
  
	
	
	
}

var data = getRegistry();

console.log(data.mails.length)

data.mails.map((dat)=>{
	dat.items.map((item)=>{
		GetProyect(item, dat)
	})
})
