const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();


//middleware bodyparser
app.use(bodyParser.urlencoded({extended: true}));

//static folder

app.use(express.static(path.join(__dirname,'public')));

//signup route
app.post('/signup',(req,res)=>{
const{firstName,lastName,email}=req.body;

//testing if fields arent empty
if(!firstName || !lastName || !email){
    res.redirect('/fail.html');
    return;
}
//data constrution , we're taking only the name, last name & email ; you can add whatever mailchip has to offer in fields
const data={
    members: [
    {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]};
//formatting the data
  const postData = JSON.stringify(data);

//requesting || replace the XXXXXX with your list ID || replace the YYYYYYYYYYYY with your API KEY || replace <DC> with your data center ID 
// check mailchimp documentation for more info !!!
const options={
    url:'https://<DC>.api.mailchimp.com/3.0/lists/XXXXXXX',
    method:'POST',
    headers:{
        Authorization:'auth YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY'
    },
    body: postData
}
//testing if everything went south or all is good
request(options,(err,response,body)=>{
if(err){
    res.redirect('/fail.html');
}else{
    if(response.statusCode ===200){
res.redirect('/success.html');
    }else{
        res.redirect('/fail.html');
    }
}
});

});

//port checking
const PORT =process.env.PORT || 5000;

//displaying the port on console
app.listen(PORT, console.log(`Server started on ${PORT}`));

