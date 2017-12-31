class Tab{
    id:string
    caption:string
    e:e

    captione:e

    constructor(id:string,caption:string,e:e){
        this.id=id
        this.caption=caption
        this.e=e
    }
}

class TabPane extends e implements CustomElement<TabPane>{
    width=600
    height=400

    table:e

    tabs:Tab[]=[]

    selectedIndex=0

    contentTd:e
    contentDiv:e

    constructor(id:string){
        super("div",id)

        this.fromStored()
    }

    toJsonText():string{
        return JSON.stringify({
            selectedIndex:this.selectedIndex
        })
    }

    fromJson(json:any){
        this.selectedIndex=json.selectedIndex
    }

    setWidth(width:number):TabPane{
        this.width=width
        return this
    }

    setHeight(height:number):TabPane{
        this.height=height
        return this
    }

    setTabs(tabs:Tab[]):TabPane{
        this.tabs=tabs
        return this
    }    

    selectByKey(key:string):TabPane{
        return this.selectByIndex(this.getIndexById(key))
    }

    selectByIndex(index:number):TabPane{
        if(index<0) return this

        if(index<this.tabs.length){
            let cfg=Globals.cfg.TabPane

            this.selectedIndex=index
            this.contentDiv=new e("div").
                z(this.width-cfg.CONTENTDIV_SHRINK_WIDTH,this.height-cfg.CONTENTDIV_SHRINK_HEIGHT).
                s("bc",cfg.CONTENTDIV_BCOL).s("ovf","scr").a([
                    this.tabs[index].e
                ])
            this.contentTd.h("").a([this.contentDiv])

            for(let i=0;i<this.tabs.length;i++){
                this.tabs[i].captione.s("bc",i==this.selectedIndex?
                    cfg.TAB_SEL_BCOL:cfg.TAB_BCOL
                )
            }

            this.store()
        }

        return this
    }

    getIndexById(id:string):number{
        for(let tabi in this.tabs){
            if(this.tabs[tabi].id==id) return parseInt(tabi)
        }
        return -1
    }

    tabClicked(tab:Tab,e:Event){
        let index=this.getIndexById(tab.id)
        this.selectByIndex(index)
    }

    build():TabPane{
        let cfg=Globals.cfg.TabPane

        this.z(this.width,this.height).s("bc",cfg.TABPANE_BCOL)
        this.table=new e("table").px("bs",cfg.TABLE_BORDER_SEP).s("bcs","separate").a([
            new e("tr").a(
                this.tabs.map(tab=>tab.captione=new e("td").h(tab.caption).s("cur","ptr").
                px("pd",cfg.TAB_PADDING).s("bc",cfg.TAB_BCOL).
                ae("md",this.tabClicked.bind(this,tab))
            )
            ),
            new e("tr").a([
                this.contentTd=new e("td").t("colspan",""+this.tabs.length)
            ])
        ])

        this.h("").a([
            this.table
        ])

        return this.selectByIndex(this.selectedIndex)
    }
}

class LogPane extends e{
    logger:Misc.Logger=new Misc.Logger()

    constructor(){
        super("div")
        this.s("ff","ms")
    }

    log(li:Misc.Logitem){
        this.logger.log(li)
        this.h(this.logger.reportHtml())
    }
}