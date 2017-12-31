class GitBrowser extends e implements CustomElement<GitBrowser>{
    usercombo:ComboBox
    repocombo:ComboBox
    tokencombo:ComboBox

    users:string[]

    passwordtext:PasswordInput
    repotext:TextInput

    constructor(){
        super("div")
    }

    usersLoaded(ok:boolean,result:any){
        if(ok){
            let json=JSON.parse(result.content)
            this.users=json.gitusers
            this.build()
        }
    }

    user:string
    password:string
    auth:any
    config:any

    scan(){
        this.user=this.usercombo.selectedKey
        this.password=this.passwordtext.getText()
        
        this.auth={
            username:this.user,
            password:this.password
        }

        this.config={
            auth:this.auth            
        }
    }

    listReposResult(ok:boolean,result:any){        
        if(ok){
            let repos=result.result
            this.repocombo.clear().addOptions(
                repos.map(repo=>new ComboOption(repo.name,repo.name))).
                selectByIndex(0).build()
        }
    }

    gitApiRequest(url:string,callback:any,method:string="get",data:any=null){
        this.scan()
        
        this.config.method=method

        let body:any={
            action:"githubapi",
            url:url,
            config:this.config
        }

        if(data!=null){
            body.config.data=data
        }

        console.log("gitApiRequest",body)

        new AjaxRequest(body,callback)
    }

    listReposClicked(e:Event){
        this.gitApiRequest("user/repos",this.listReposResult.bind(this))
    }

    tokensById:{[id:string]:string}={}

    createTokenResult(ok:boolean,result:any){
        if(ok){
            let data=result.result
            this.tokensById[data.id]=data.token
            this.listTokensClicked(null)
        }
    }

    createToken(scopes:string[]){
        let rnd=Math.floor(Math.random()*10000)
        let tokenName=`token_${rnd}`
        this.gitApiRequest("authorizations",this.createTokenResult.bind(this),"post",{
            scopes:scopes,
            note:tokenName
        })
    }

    listTokensResult(ok:boolean,result:any){
        if(ok){
            let data=result.result.reverse()
            this.tokencombo.clear().addOptions(
                data.map(token=>new ComboOption(token.id,`${token.id} ${token.note} ${token.scopes.join(",")} ${this.tokensById[token.id]}`))
            ).selectByIndex(0).build()
            if(this.resetRepo!=undefined){
                this.deleteRepoClicked(null)
            }
        }
    }

    listTokensClicked(e:Event){
        this.gitApiRequest("authorizations",this.listTokensResult.bind(this))
    }

    deleteTokenResult(ok:boolean,result:any){
        if(ok){
            this.listTokensClicked(null)
        }        
    }

    deleteTokenClicked(e:Event){
        let id=this.tokencombo.selectedKey
        this.gitApiRequest("authorizations/"+id,this.deleteTokenResult.bind(this),"delete")
    }

    deleteRepoResult(ok:boolean,result:any){
        if(ok){
            this.listReposClicked(null)
            if(this.resetRepo!=undefined){
                this.repotext.setText(this.resetRepo)
                this.createRepoClicked(null)
            }
        }
    }

    deleteRepoClicked(e:Event){
        let tokenid=this.tokencombo.selectedKey
        if(tokenid!=null){
            let token=this.tokensById[tokenid]
            if(token!=undefined){
                let user=this.usercombo.selectedKey
                let repo=this.repocombo.selectedKey
                if((user!=null)&&(repo!=null)){
                    let url="repos/"+user+"/"+repo+"?access_token="+token
                    this.gitApiRequest(url,this.deleteRepoResult.bind(this),"delete")
                }                
            }
        }
    }

    createRepoResult(ok:boolean,result:any){
        if(ok){
            this.repotext.setText("")
            this.listReposClicked(null)
            if(this.resetRepo!=undefined){
                this.resetRepo=undefined
                this.deleteTokenClicked(null)
            }
        }
    }

    createRepoClicked(e:Event){
        let repoName=this.repotext.getText()
        if(repoName!=""){
            this.gitApiRequest("user/repos",this.createRepoResult.bind(this),"post",{
                name:repoName
            })
        }
    }

    resetRepo:string

    resetRepoClicked(e:Event){
        let repo=this.repocombo.selectedKey
        if(repo!=null){
            this.resetRepo=repo
            this.createToken(["delete_repo"])
        }
    }

    build():GitBrowser{
        this.px("bs",5).s("bcs","separate").h("").a([
            new e("tr").a([
                new e("td").h("Password : ").a([
                    this.passwordtext=new PasswordInput()
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.usercombo=new ComboBox("gitbrowser").build()
                ]),
                new e("td").a([
                    new Button("List repos").onClick(this.listReposClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.repocombo=new ComboBox("repobrowser").build()
                ]),
                new e("td").a([
                    new Button("Delete repo").onClick(this.deleteRepoClicked.bind(this))
                ]),
                new e("td").a([
                    new Button("Reset repo").onClick(this.resetRepoClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.repotext=new TextInput()
                ]),
                new e("td").a([
                    new Button("Create repo").onClick(this.createRepoClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    new Button("Create delete_repo token").onClick(this.createToken.bind(this,["delete_repo"]))
                ]),
                new e("td").a([
                    new Button("List tokens").onClick(this.listTokensClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.tokencombo=new ComboBox("tokenbrowser").build()
                ]),
                new e("td").a([
                    new Button("Delete token").onClick(this.deleteTokenClicked.bind(this))
                ])
            ])
        ])

        this.tokencombo.px("w",300)

        if(this.users==undefined){
            new AjaxRequest({
                action:"readtextfile",
                path:"gitusers.json"
            },this.usersLoaded.bind(this))
        } else {
            this.usercombo.clear().addOptions(
                this.users.map(user=>new ComboOption(user,user))
            ).selectByIndex(0).build()            
        }
    
        return this
    }
}