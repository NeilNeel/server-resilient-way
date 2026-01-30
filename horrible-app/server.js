const express = require('express');
const os = require('os'); // To get the Hostname (Container ID)
const crypto = require('crypto'); // For heavy calculations
const app = express();
const port = 3000;

let mute=false;

// Mute middleware - must be before other routes
app.use((req,res,next)=>{
    if(mute && req.path !== '/mute'){
        // Just hang the request - don't respond, don't use CPU
        return;
    }
    next();
});

// the landing endpoint
app.get('/', (req,res)=>{
    const hostname = os.hostname();
    res.send(`
        <html>
        <head>
            <title>Horrible Project</title>
            <style>
                body { 
                    background-color: #1a1a1a; 
                    color: #ffffff; 
                    font-family: sans-serif; 
                    padding: 40px; 
                    line-height: 1.5;
                }
                h1, h2 { text-align: center; }
                h2 { color: #cccccc; font-weight: normal;}
                ul { max-width: 800px; margin: 0 auto; }
                li { margin-bottom: 30px; }
                a { 
                    color: #fff; 
                    text-decoration: underline; 
                    font-size: 1.2em; 
                    font-weight: bold; 
                }
                a:hover { color: #aaa; }
                p.desc { margin-top: 5px; color: #cccccc; }
            </style>
        </head>
        <body>
            <h1>What do you want to do?</h1>
            <h2>The hostname is: ${hostname}</h2>
            
            <div style="max-width: 800px; margin: 0 auto;">
                <p>Welcome to this horrible project. Please choose what you want to do:</p>
            </div>

            <ul>
                <li>
                    <a href="/crash">Crash server</a>
                    <p class="desc">Click here to crash this server. The NodeJS instance will exit normally. Future requests won't be served.</p>
                </li>
                
                <li>
                    <a href="/freeze">Freeze server</a>
                    <p class="desc">Click here to freeze the server. The NodeJS instance will enter an infinite loop, causing it to become unresponsive, also to future requests.</p>
                </li>
                
                <li>
                    <a href="/mute">Mute server</a>
                    <p class="desc">Click here to mute the server. The NodeJS instance will stop responding to all future requests - but without using any CPU.</p>
                </li>
                
                <li>
                    <a href="/heavy">Calculate things on the server (10s)</a>
                    <p class="desc">The NodeJS instance will run some heavy calculations for 10s. However, it will still be responsive to other requests.</p>
                </li>
            </ul>
        </body>
        </html>
    `);
});

// crash endpoint
app.get('/crash',(req,res)=>{
    console.log("Crashing the server");
    res.send("Crashing the server now");
    setTimeout(() => {
        process.exit(1);
    }, 100);
});

// freeze endpoint
app.get('/freeze',(req,res)=>{
    console.log("Freezing the server");
    res.send("Freezing the server");
    while (true){}
});

//mute endpoint
app.get('/mute',(req,res)=>{
    console.log("Muting the server");
    mute=true;
    res.send("Muting the server");
});

// 5. HEAVY CALCULATION (will take 10 seconds)
app.get('/heavy', (req, res) => {
    console.log("Heavy calculation started");
    const start = Date.now();
    
    crypto.pbkdf2('secret', 'salt', 5000000, 64, 'sha512', (err, derivedKey) => {
        const end = Date.now();
        res.send(`Heavy Calculation Done! Took ${(end - start)/1000} seconds`);
    });
});

app.listen(port, () => {
    console.log(`Horrible Server running on port ${port}`);
});