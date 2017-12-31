import abbrev=Config.domAbbrev
import getAbbrev=Config.getAbbrev

namespace DomUtils{
    export function limit(x:number,min:number,max:number):number{
        if(x<min) return min
        if(x>max) return max
        return x
    }

    export function createArrow(fromX:number,fromY:number,toX:number,toY:number,param:any):e{
        let arrow=new Vectors.Arrow(
            new Vectors.Vect(fromX,fromY),
            new Vectors.Vect(toX,toY),
            param
        )
        let ad=new e("div").pa().o(
            arrow.svgorig.x,arrow.svgorig.y
        ).h(arrow.svg)
        return ad
    }
}

import limit=DomUtils.limit

class JsonSerializable{
    id:string

    storeId():string{
        return this.id
    }

    constructor(id:string){
        this.id=id
    }

    fromJson(json:any){}
    fromJsonText(jsontext:string){
        try{
            let json=JSON.parse(jsontext)
            this.fromJson(json)
        }catch(e){}
    }
    toJsonText():string{
        return JSON.stringify(this)
    }
    toJson():any{
        return JSON.parse(this.toJsonText())
    }
    store(){
        let storeid=this.storeId()
        let jsontext=this.toJsonText()
        localStorage.setItem(storeid,jsontext)
        //console.log("store",storeid,jsontext)
    }
    stored():string{
        return localStorage.getItem(this.storeId())
    }
    hasStored(){        
        return !Misc.isUndefined(this.stored())
    }
    fromStored(){        
        //console.log("fromStored",this.id,this.stored())
        if(!this.hasStored()) return
        try{
            this.fromJsonText(this.stored())
        }catch(e){}
    }
    copyFrom(js:JsonSerializable){
        this.fromJsonText(js.toJsonText())
    }
}

class e extends JsonSerializable{
    e:HTMLElement    

    static l:{[id:string]:e}={}

    key:string="" // for sorting content

    focus():e{this.e.focus();return this}
    blur():e{this.e.blur();return this}

    k(key:string):e{
        this.key=key
        return this
    }

    constructor(tag:string,id:string=null){
        super(id)
        tag=getAbbrev(tag)
        this.e=document.createElement(tag)        
        if(id!=null) e.l[id]=this
    }

    pr():e{this.s("pos","rel");return this}
    pa():e{this.s("pos","abs");return this}

    bu(name:string):e{this.s("bg",`url(assets/images/backgrounds/${name})`);return this}

    o(l:number=0,t:number=0):e{
        return this.px("l",l).px("t",t)
    }

    z(w:number=0,h:number=0):e{
        return this.px("w",w).px("h",h)
    }

    r(l:number=0,t:number=0,w:number=0,h:number=0):e{
        return this.o(l,t).z(w,h)
    }

    c(){
        return getComputedStyle(this.e)
    }

    static getPx(v:string):number{
        v=v.replace("px","")
        return parseFloat(v)
    }

    cpx(p:string):number{
        return e.getPx(this.c()[getAbbrev(p)])
    }

    a(es:e[]):e{
        es.map(e=>this.e.appendChild(e.e))
        return this
    }

    s(p:string,s:string):e{
        p=getAbbrev(p)
        s=getAbbrev(s)
        this.e.style[p]=s
        return this
    }

    n(p:string,n:number){
        return this.s(p,""+n)
    }

    px(p:string,n:number):e{
        return this.s(p,n+"px")
    }

    ae(kind:string,handler:(Event)=>void):e{
        kind=getAbbrev(kind)
        this.e.addEventListener(kind,handler)
        return this
    }

    h(content:string=""):e{
        this.e.innerHTML=content
        return this
    }

    t(a:string,v:string):e{
        a=getAbbrev(a)
        v=getAbbrev(v)
        this.e.setAttribute(a,v)
        return this
    }    

    tn(a:string,n:number):e{
        a=getAbbrev(a)
        this.e.setAttribute(a,""+n)
        return this
    }    

    rt(a:string):e{
        a=getAbbrev(a)
        this.e.removeAttribute(a)
        return this
    }    

    bcr(){
        return this.e.getBoundingClientRect()
    }

    bcrt(){return this.bcr().top}
    bcrl(){return this.bcr().left}
}

class Button extends e{
    constructor(caption:string="",id:string=null){
        super("input",id)
        this.t("type","button")
        this.t("value",caption)
    }
    onClick(handler:(Event)=>void):Button{
        this.ae("md",handler)        
        return this
    }
}

class TextInput extends e{
    constructor(id:string=null){
        super("input",id)
        this.t("type","text")
    }    
    setText(content:string):TextInput{
        this.e["value"]=content
        return this
    }
    getText():string{
        return this.e["value"]
    }
}

class TextArea extends e{
    constructor(id:string=null){
        super("textarea",id)
    }    
    setText(content:string):TextArea{
        this.e.innerHTML=content
        return this
    }
    getText():string{
        return this.e["value"]
    }
}

class PasswordInput extends e{
    constructor(id:string=null){
        super("input",id)
        this.t("type","password")
    }    
    setText(content:string):TextInput{
        this.e["value"]=content
        return this
    }
    getText():string{
        return this.e["value"]
    }
}

interface CustomElement<T>{
    build():T
}

class ComboOption extends e{
    key:string
    display:string

    constructor(key:string,display:string){
        super("option")
        this.key=key
        this.display=display        
        this.t("value",key).h(this.display)
    }
}

class ComboBox extends e implements CustomElement<ComboBox>{
    options:ComboOption[]=[]

    selectedIndex:number=-1

    clear():ComboBox{
        this.options=[]
        this.selectedIndex=-1
        return this
    }

    addOptions(os:ComboOption[]):ComboBox{
        os.map(o=>this.options.push(o))
        return this
    }

    selectByIndex(index:number):ComboBox{
        if(this.options.length<=index){
            this.selectedIndex=-1
            this.selectedKey=null
            return this
        }
        this.selectedIndex=index
        this.selectedKey=this.options[this.selectedIndex].key
        for(let i=0;i<this.options.length;i++){
            this.options[i].rt("selected")
            if(i==this.selectedIndex){
                this.options[i].t("selected","true")
            }
        }
        return this
    }

    indexByKey(key:string):number{
        for(let i=0;i<this.options.length;i++){
            if(this.options[i].key==key) return i
        }
        return -1
    }

    selectByKey(key:string){
        this.selectByIndex(this.indexByKey(key))
    }

    constructor(id:string=null){
        super("select",id)
    }

    build():ComboBox{
        this.h("").a(this.options)
        this.ae("change",this.change.bind(this))
        return this
    }

    changeHandler:Misc.EventHandler

    selectedKey:string

    change(e:Event){
        let t=<any>e.target
        this.selectedKey=t.selectedOptions[0].value        
        this.selectedIndex=this.indexByKey(this.selectedKey)
        if(this.changeHandler!=undefined) this.changeHandler(e)
    }

    onChange(handler:Misc.EventHandler):ComboBox{
        this.changeHandler=handler        
        return this
    }
}

class FileView extends e implements CustomElement<FileView>{
    file:any
    ld:LayeredDocument
    ldi:number

    contentdiv:e

    constructor(file:any,ld:LayeredDocument,ldi:number){
        super("div")
        this.file=file
        this.ld=ld
        this.ldi=ldi
    }

    closeClicked(e:Event){
        this.ld.closeLayer(this.ldi)
    }

    layer:e

    ajaxasset:AjaxAsset

    ajaxok(){
        let resjson=this.ajaxasset.resjson
        let content=resjson.content
        this.contentdiv.h(content)
    }

    ajaxfailed(){

    }

    loadFile(){
        this.ajaxasset=new AjaxAsset({
            action:"readtextfile",
            path:this.file.abspath
        })
        new AssetLoader().
            add(this.ajaxasset).
            setcallback(this.ajaxok.bind(this)).
            seterrorcallback(this.ajaxfailed.bind(this)).
            load()
    }

    build():FileView{
        this.h("").pa().r(50,50,620,450).s("bc","#dfd").a([
            new Button("Close").onClick(this.closeClicked.bind(this)).px("mgt",5).px("mgl",10),
            new e("br"),
            this.contentdiv=new e("ta").px("mgl",10).px("mgt",5).z(600,400)
        ])
        this.layer=this.ld.openLayer(this.ldi)
        this.layer.a([this])
        this.loadFile()
        return this
    }
}

class DragDiv extends e implements CustomElement<DragDiv>{
    LARGETOPBAR_PADDING=100

    MIN_TOP=0
    MIN_LEFT=0
    MAX_TOP=400
    MAX_LEFT=1000

    width=200
    height=50

    left=0
    top=0

    dragstart:Vectors.ScreenVector
    dragd:Vectors.ScreenVector
    dragunderway:boolean=false

    largetopbar:e

    limitTop(t:number){return limit(t,this.MIN_TOP-this.computedTop,this.MAX_TOP-this.computedTop)}
    limitLeft(l:number){return limit(l,this.MIN_LEFT-this.computedLeft,this.MAX_LEFT-this.computedLeft)}

    setTop(top:number):DragDiv{this.top=top;return this}
    setLeft(left:number):DragDiv{this.left=left;return this}
    setWidth(width:number):DragDiv{this.width=width;return this}
    setHeight(height:number):DragDiv{this.height=height;return this}

    setLargeTopBar(largetopbar:e):DragDiv{this.largetopbar=largetopbar;return this}

    computedTop:number
    computedLeft:number

    mouseMoveCallback
    mouseUpCallback

    setMouseMoveCallback(mouseMoveCallback):DragDiv{this.mouseMoveCallback=mouseMoveCallback;return this}
    setMouseUpCallback(mouseUpCallback):DragDiv{this.mouseUpCallback=mouseUpCallback;return this}

    moveDiv:boolean=false

    setMoveDiv(moveDiv:boolean):DragDiv{this.moveDiv=moveDiv;return this}

    limitedDragd():Vectors.ScreenVector{
        return this.dragd
    }

    windowdragstart(e:Event){
        e.preventDefault()
        let me=<MouseEvent>e
        this.dragstart=new Vectors.ScreenVector(me.clientX,me.clientY)            
        this.dragunderway=true                
        this.largetopbar.z(2*this.LARGETOPBAR_PADDING+this.width,2*this.LARGETOPBAR_PADDING+this.height)
        this.computedTop=this.bcrt()
        this.computedLeft=this.bcrl()
    }

    windowmouseout(e:Event){        
        this.windowmousemove(e)
        this.windowmouseup(null)
        this.dragunderway=false
    }

    windowmousemove(e:Event){  
        let me=<MouseEvent>e      
        if(this.dragunderway){
            this.dragd=new Vectors.ScreenVector(me.clientX,me.clientY).Minus(this.dragstart)                                    
            let ldd=this.limitedDragd()
            if(this.mouseMoveCallback!=undefined){
                this.mouseMoveCallback(ldd)
            }
            if(this.moveDiv){
                this.o(this.left+ldd.x,this.top+ldd.y)
            }
        }
    }

    windowmouseup(e:Event){
        if(this.dragunderway){
            this.dragunderway=false               
            this.largetopbar.z()
            let ldd=this.limitedDragd()
            if(this.mouseUpCallback!=undefined){
                this.mouseUpCallback(ldd)
            }
            if(this.moveDiv){
                this.top=this.top+ldd.y
                this.left=this.left+ldd.x
                this.o(this.left,this.top)
            }
        }
    }

    build():DragDiv{
        this.r(this.left,this.top,this.width,this.height).
            t("dr","true").pa().s("cur","mv").
            ae("dragstart",this.windowdragstart.bind(this))
        this.largetopbar.pa().s("bc","#00f").n("op",0.0).
            o(-this.LARGETOPBAR_PADDING,-this.LARGETOPBAR_PADDING).z().
            ae("mm",this.windowmousemove.bind(this)).                    
            ae("mo",this.windowmouseout.bind(this)).                    
            ae("mu",this.windowmouseup.bind(this))
        return this
    }

    constructor(){
        super("div")
    }
}

class RadioButton{
    key:string
    caption:string
    bcol:string
    button:e
    index:number
    constructor(key:string,caption:string,bcol:string="#efefef"){
        this.key=key
        this.caption=caption
        this.bcol=bcol
    }
}

class RadioButtons extends e implements CustomElement<RadioButtons>{
    buttons:RadioButton[]

    selectedIndex:number=-1

    setButtons(buttons:RadioButton[]):RadioButtons{
        this.buttons=buttons
        for(let i=0;i<this.buttons.length;i++) this.buttons[i].index=i
        return this
    }

    constructor(){
        super("table")
        this.px("bs",2).s("bcs","separate")
    }

    showSelected(){
        for(let i=0;i<this.buttons.length;i++){
            let b=this.buttons[i]
            let bcol=i==this.selectedIndex?b.bcol:"initial"
            b.button.s("bc",bcol)
        }
    }

    setSelectedIndex(index:number):RadioButtons{
        this.selectedIndex=index
        this.showSelected()
        return this
    }

    buttonClicked(b:RadioButton,e:Event){
        this.setSelectedIndex(b.index)
    }

    build():RadioButtons{
        this.h("").a([
            new e("tr").a(
                this.buttons.map(b=>
                    new e("td").a([b.button=new Button(b.caption).
                    onClick(this.buttonClicked.bind(this,b))])
                )    
            )
        ])

        this.showSelected()

        return this
    }
}

class EditableList<T> extends e implements CustomElement<EditableList<T>>{
    list:T[]

    title:any
    factory:any
    indexDecorator=(i:number)=>`${i}.`

    constructor(){
        super("table")        
    }

    setTitle(title):EditableList<T>{
        if(typeof title=="string"){
            this.title=new e("label").h(title)
        } else this.title=title
        return this
    }

    setList(list:T[]):EditableList<T>{
        this.list=list
        return this
    }

    setFactory(factory):EditableList<T>{
        this.factory=factory
        return this
    }

    setIndexDecorator(indexDecorator):EditableList<T>{
        this.indexDecorator=indexDecorator
        return this
    }

    applyCallback:any

    setApplyCallback(callback:any):EditableList<T>{
        this.applyCallback=callback
        return this
    }

    applyClicked(e:Event){
        if(this.applyCallback!=undefined) this.applyCallback()
    }

    deleteClicked(i:number,e:Event){
        this.list.splice(i,1)
        this.build()
    }

    addClicked(){
        if(this.factory!=undefined){
            this.list.push(this.factory())                        
            this.build()
        }
    }

    build():EditableList<T>{
        this.px("bs",2).s("bcs","separate").px("pd",5).s("bc","#ab9").h("")
        this.a([
            new e("tr").a([
                new e("td"),
                new e("td").t("align","center").a([
                    this.title
                ]).tn("cs",2)
            ]),
            new e("tr").a([
                new e("td"),
                new e("td").tn("cs",2).s("bc","#ddf").px("pd",3).a([
                        new e("div").px("pd",3).s("bc","#7f7").s("float","left").a([
                            new Button("Apply").
                            onClick(this.applyClicked.bind(this)).
                            px("w",100)
                        ]),
                        new e("div").px("mgt",1).px("pd",2).s("bc","#aaf").s("float","right").a([
                            new Button("+ Add new").
                            onClick(this.addClicked.bind(this))
                        ])                        
                    ])
                ])
            ])
            let i=0
            this.a(
                this.list.map(item=>{
                    return new e("tr").a([
                        new e("td").h(this.indexDecorator(i+1)).px("pdr",5),
                        new e("td").a([<any>item]),
                        new e("td").a([
                            new e("div").px("pd",3).s("bc","#d77").a([
                                new Button("Delete").
                                onClick(this.deleteClicked.bind(this,i++))
                            ])                            
                        ])
                    ])
                }
            )
        )
        return this
    }
}