class CommandLineOption{
    fullName:string
    shortName:string
    numargs:number=0

    args:string[]=[]

    constructor(fullName:string,shortName:string,numargs:number){
        this.fullName=fullName
        this.shortName=shortName
        this.numargs=numargs
    }
}

namespace CommandLineOptions{
    export let allowedOptions:CommandLineOption[]=[]

    export let parsedOptions:{[id:string]:CommandLineOption}={}

    export function parseOptions(){
        parsedOptions={}
        if(process.argv.length>2){
            let i=2
            while(i<process.argv.length){
                let arg=process.argv[i]
                let found:CommandLineOption=null
                for(let ao of allowedOptions){
                    if((ao.fullName==arg)||(ao.shortName==arg)){
                        found=new CommandLineOption(ao.fullName,ao.shortName,ao.numargs)
                        break;
                    }
                }
                if(found!=null){
                    let numargs=found.numargs
                    if((i+numargs)>=process.argv.length){
                        return
                    }
                    for(let j=0;j<numargs;j++){
                        found.args.push(process.argv[(i+1)+j])
                    }
                    i+=(numargs+1)
                    parsedOptions[found.fullName]=found
                }else{
                    console.log("invalid option "+arg)
                    i++
                }
            }
        }
    }
}