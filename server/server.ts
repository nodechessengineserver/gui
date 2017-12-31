namespace Server{
    export let ajaxHandler=function(req,res){    
        let action=req.body.action  
        console.log(`ajax ${action}`)
        
        let b=req.body
        
        res.setHeader("Content-Type","application/json")
        
        if(action=="listdir"){
            System.listDir(b.path,(err,files)=>{
                let result={err:err,files:files}
                res.send(JSON.stringify(result))
            })    
        }  
        
        if(action=="createdir"){
            System.createDir(b.path,b.name,(err,files)=>{
                let result={err:err,files:files}
                res.send(JSON.stringify(result))
            })    
        }  
        
        if(action=="removedir"){
            System.removeDir(b.path,b.name,(err,files)=>{
                let result={err:err,files:files}
                res.send(JSON.stringify(result))
            })    
        }  
        
        if(action=="writetextfile"){
            System.writeTextFile(b.path,b.content,(err)=>{
            let result={err:err}
            res.send(JSON.stringify(result))
            })    
        }  
        
        if(action=="readtextfile"){
            System.readTextFile(b.path,(err,data)=>{
            let result={
                error:false,
                content:""
            }
            if(err){
                result.error=true
            }else{
                result.content=data
            }      
            res.send(JSON.stringify(result))
            })
        }  
        
        if(action=="copyfile"){
            System.copyFile(b.pathFrom,b.pathTo,(err)=>{
            res.send(JSON.stringify(err))
            })    
        }  
        
        if(action=="movefile"){
            System.moveFile(b.pathFrom,b.pathTo,(err)=>{
            res.send(JSON.stringify(err))
            })    
        }  
        
        if(action=="renamefile"){
            System.renameFile(b.pathFrom,b.pathTo,(err)=>{
            res.send(JSON.stringify(err))
            })    
        }  
        
        if(action=="deletefile"){
            System.deleteFile(b.path,(err)=>{
            res.send(JSON.stringify(err))
            })    
        }  

        if(action=="githubapi"){            
            System.githubApiRequest(b.url,b.config).then(response=>{                
                res.send(JSON.stringify({
                    ok:true,
                    result:response.data
                }))
            }).catch(err=>{
                console.log(err)
                res.send(JSON.stringify({
                    ok:false,
                    result:{}
                }))
            })
        }
    }
}