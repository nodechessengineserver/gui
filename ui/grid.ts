class SortableGridKey extends e implements CustomElement<SortableGridKey>{
    key:string
    parent:SortableGrid
    sortfunc:Misc.SortFunc
    index:number=0
    direction:number=1

    constructor(key:string,parent:SortableGrid,sortfunc:Misc.SortFunc=Misc.defaultSortFunc){
        super("table",parent.id+"_"+key)
        this.key=key
        this.parent=parent
        this.sortfunc=sortfunc
        this.fromStored()
    }

    toJson():any{
        return {
            index:this.index,
            direction:this.direction
        }
    }

    fromJson(json:any){
        this.index=json.index || 0
        this.direction=json.direction || 1
    }

    toJsonText():string{
        return JSON.stringify(this.toJson())
    }

    sortPressed(direction:number,e:Event){
        this.direction=direction
        this.build()
        this.store()
        this.parent.build()
    }

    static SEL_BCOL="#0f0"
    static UNSEL_BCOL="#eee"

    build(){
        let tr=new e("tr")
        if(this.index>0)
            tr.a([new e("td").a([new Button("<").onClick(this.parent.moveColumn.bind(this.parent,this,-1))])])
        if(this.index<(this.parent.keys.length-1))
            tr.a([new e("td").a([new Button(">").onClick(this.parent.moveColumn.bind(this.parent,this,1))])])
        this.px("bs",1).s("bcs","separate").h("").a([tr.a([            
            new e("td").h(this.key),
            new e("td").a([
                new Button("a").onClick(this.sortPressed.bind(this,1)).
                s("bc",this.direction==1?SortableGridKey.SEL_BCOL:SortableGridKey.UNSEL_BCOL)
            ]),
            new e("td").a([
                new Button("d").onClick(this.sortPressed.bind(this,-1)).
                s("bc",this.direction==-1?SortableGridKey.SEL_BCOL:SortableGridKey.UNSEL_BCOL)
            ])
        ])])
        this.store()
        return this
    }
}

class SortableGridIndex{
    row:number
    key:string
    constructor(row:number,key:string){
        this.row=row
        this.key=key
    }
    hash():string{return `${this.row},${this.key}`}
}

class SortableGrid extends e implements CustomElement<SortableGrid>{
    keys:SortableGridKey[]=[]

    items:{[id:string]:e}={}

    clearItems(){this.items={}}

    maxrow:number=0

    setItem(sgi:SortableGridIndex,e:e){
        this.items[sgi.hash()]=e
        if(sgi.row>this.maxrow) this.maxrow=sgi.row
    }
    getItem(sgi:SortableGridIndex):e{return this.items[sgi.hash()]}

    moveColumn(key:SortableGridKey,direction:number){
        let index=this.keys.indexOf(key)
        if(index<0) return // invalid key
        let before=this.keys.slice(0,index)
        let beforelast=before.pop()
        let after=this.keys.slice(index+1)
        let afterfirst=after.shift()        
        let result=this.keys
        if((direction==-1)&&(beforelast!=undefined)){
            result=[...before,key,beforelast,afterfirst,...after]
        }        
        if((direction==1)&&(afterfirst!=undefined)){
            result=[...before,beforelast,afterfirst,key,...after]
        }        
        result=result.filter(key=>key!=undefined)
        this.keys=result
        this.build()
    }

    sort(){
        let indices:number[]=[]
                
        for(let row=this.numFixed;row<=this.maxrow;row++){
            indices.push(row)            
        }           

        indices.sort((ia,ib)=>{
            for(let key of this.keys){
                let a=this.getItem(new SortableGridIndex(ia,key.key)).key
                let b=this.getItem(new SortableGridIndex(ib,key.key)).key

                let cmp=key.sortfunc(a,b)                
                
                if(cmp!=0) {
                    let ecmp=cmp*key.direction                    
                    return ecmp
                }
            }            
            return 0
        })

        for(let i=this.numFixed-1;i>=0;i--) indices.unshift(i)

        let newitems:{[id:string]:e}={}

        for(let row=0;row<=this.maxrow;row++){
            for(let key of this.keys){
                newitems[new SortableGridIndex(row,key.key).hash()]=
                    this.items[new SortableGridIndex(indices[row],key.key).hash()]
            }
        }        

        this.items=newitems
    }

    setKeys(keys:SortableGridKey[]):SortableGrid{
        this.keys=keys
        this.sortKeys()
        return this
    }

    numFixed:number=0

    setNumFixed(numFixed:number):SortableGrid{this.numFixed=numFixed;return this}

    constructor(id:string){
        super("table",id)
    }

    sortKeys(){
        this.keys.sort((a,b)=>(a.index-b.index))
    }

    tablerows:e[]

    markRow(row:number,kind:string="mark"){
        if(row<0) return
        switch(kind){
            case "mark":this.tablerows[row].s("bc","0f0");break
            case "unmark":this.tablerows[row].s("bc","initial");break
        }        
    }

    unMarkAllRows(){
        for(let row=0;row<=this.maxrow;row++){
            this.markRow(row,"unmark")
        }
    }

    getRowByColValue(key:string,value:string):number{
        for(let row=0;row<=this.maxrow;row++){
            let item=this.getItem(new SortableGridIndex(row,key))
            if(item.key==value) return row
        }
        return -1
    }

    build():SortableGrid{        
        this.sort()
        this.px("bs",5).s("bcs","separate").h("").a([new e("tr").a(
            this.keys.map(key=>new e("td").a([key.build()]))
        )])
        this.tablerows=[]
        for(let row=0;row<=this.maxrow;row++){
            this.a([this.tablerows[row]=new e("tr").a(
                this.keys.map(key=>{
                    let item=this.getItem(new SortableGridIndex(row,key.key))
                    let x=item==undefined?new e("div").h(""):item
                    return new e("td").a([x])
                })
            )]) 
        }
        for(let index=0;index<this.keys.length;index++){
            this.keys[index].index=index
            this.keys[index].build()
        }
        return this
    }
}