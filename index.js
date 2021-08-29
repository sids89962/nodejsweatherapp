const http =  require('http');
const fs =  require('fs');
var requests =  require('requests');

const homeFile =  fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
     temperature = temperature.replace("{%location%}", orgVal.name);
     temperature = temperature.replace("{%country%}", orgVal.sys.country);
     temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main);
    //  {%tempStatus%}
     return temperature;
 
    
}
const server = http.createServer((req,res)  => {
    if(req.url == "/")
     {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Noida&appid=e91b24957c466cb1c36bc7d2a31c01c1")
        .on('data',  (chunk) => {
            const objdata =JSON.parse(chunk);
            const arrData = [objdata];
        //   console.log(arrData[0].main.temp);
        const realTimeData =  arrData.map(val => 
            replaceVal(homeFile, val)).join("");
            res.write(realTimeData);
        })
        .on('end',  (err) => {
          if (err) return console.log('connection closed due to errors', err);
         
         res.end();
        });
        
     }
});

server.listen(3000,"127.0.0.1",() => {
    console.log('Server is running')
});