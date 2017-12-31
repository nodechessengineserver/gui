/////////////////////////////////////////////////////////////
// command line

CommandLineOptions.allowedOptions=[
    new CommandLineOption("--dirname","-d",1),
    new CommandLineOption("--port","-p",1),
    new CommandLineOption("--githubapi","-g",1),
    new CommandLineOption("--username","-un",1),
    new CommandLineOption("--password","-pw",1),
    new CommandLineOption("--method","-mt",1),
    new CommandLineOption("--data","-dt",1)
]

CommandLineOptions.parseOptions()

let po=CommandLineOptions.parsedOptions

let doServer:boolean=true

if(po["--githubapi"]!=undefined){
    let url=po["--githubapi"].args[0]
    let config:any={
        method:'get'
    }
    if((po["--username"]!=undefined)&&(po["--password"]!=undefined)){
        config.auth={
            username:po["--username"].args[0],
            password:po["--password"].args[0]
        }
    }
    if(po["--method"]!=undefined){
        config.method=po["--method"].args[0]
    }
    if(po["--data"]!=undefined){
        config.data=JSON.parse(po["--data"].args[0])
    }
    System.githubApiRequest(url,config).then(response=>{
        console.log(response.data)
    }).catch(err=>{console.log(err)})
    doServer=false
}

if(po["--dirname"]!=undefined){
    ___dirname = po["--dirname"].args[0]
}

if(po["--port"]!=undefined){
    ___port = parseInt(po["--port"].args[0]) || 9000
}

/////////////////////////////////////////////////////////////

if(doServer){

    console.log(`server directory ${__dirname}`)

    console.log(`files will be served from ${___dirname}`)
    
    console.log(`port ${___port}`)

    createServer()

}

/////////////////////////////////////////////////////////////

function createServer(){

    const app = Imports.express()

    app.use('/', Imports.express.static(___dirname))

    app.use('/ajax', Imports.bodyParser.json({limit:'10mb'}))

    app.post('/ajax', Server.ajaxHandler)

    const server = Imports.http.createServer(app)

    server.listen(___port, () => {
        console.log(`Node server started on port ${server.address().port}`)
    })

}

/////////////////////////////////////////////////////////////