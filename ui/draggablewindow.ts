class DraggableWindow extends e implements CustomElement<DraggableWindow>{    
    BAR_WIDTH=Globals.cfg.DraggableWindow.BAR_WIDTH
    BOTTOM_BAR_WIDTH=Globals.cfg.DraggableWindow.BOTTOM_BAR_WIDTH
    PADDING=Globals.cfg.DraggableWindow.PADDING

    DEFAULT_WIDTH=Globals.cfg.DraggableWindow.DEFAULT_WIDTH
    DEFAULT_HEIGHT=Globals.cfg.DraggableWindow.DEFAULT_HEIGHT

    top:number=0
    left:number=0
    width:number
    height:number
    widgetHeight:number=0

    topbardiv:DragDiv
    contentdiv:e
    widgetdiv:e
    bottombardiv:e    

    title:string=""

    ld:LayeredDocument
    ldi:number

    setDefaultSize(){
        this.width=this.DEFAULT_WIDTH
        this.height=this.DEFAULT_HEIGHT
    }

    constructor(id:string,ld:LayeredDocument,ldi:number){
        super("div",id)
        this.ld=ld
        this.ldi=ldi        
        this.setDefaultSize()
        this.fromStored()        
        ld.openLayer(ldi).a([this])
    }

    setWidgetHeight(widgetHeight:number):DraggableWindow{
        this.widgetHeight=widgetHeight
        return this
    }

    setTitle(title:string):DraggableWindow{
        this.title=title
        return this
    }

    setWidth(width:number):DraggableWindow{this.width=width;return this}
    setHeight(height:number):DraggableWindow{this.height=height;return this}

    buttons:[string,any][]=[
        ["Cancel",this.cancel]
    ]

    adjustMiddle(){
        this.left=(window.innerWidth-this.totalWidth())/2
        this.top=(window.innerHeight-this.totalHeight())/2
    }

    largetopbar:e

    dragMouseMoveCallback(dragd:Vectors.ScreenVector){
        this.o(this.left+dragd.x,this.top+dragd.y)
    }

    dragMouseUpCallback(dragd:Vectors.ScreenVector){
        this.left=this.left+dragd.x
        this.top=this.top+dragd.y
        this.o(this.left,this.top)
        this.store()
    }

    dragSizeMouseMoveCallback(dragd:Vectors.ScreenVector){
        
    }

    dragSizeMouseUpCallback(dragd:Vectors.ScreenVector){
        this.width+=dragd.x
        this.height+=dragd.y
        this.store()
        this.build()
    }

    dragSizeDiv:DragDiv
    dragSizeLargeTopBar:e

    DRAG_SIZE_DIV_WIDTH=Globals.cfg.DraggableWindow.DRAG_SIZE_DIV_WIDTH

    build():DraggableWindow{      
        let cfg=Globals.cfg.DraggableWindow  
        if(!this.hasStored()){
            this.adjustMiddle()
        }
        this.pa().z(this.totalWidth(),this.totalHeight()).bu("wood.jpg")
        this.h().o(this.left,this.top).a([
            //////////////////////////////////////////////
            this.topbardiv=<DragDiv>new DragDiv().
                setLeft(this.PADDING).setTop(this.PADDING).
                setWidth(this.width).setHeight(this.height).
                setMouseMoveCallback(this.dragMouseMoveCallback.bind(this)).
                setMouseUpCallback(this.dragMouseUpCallback.bind(this)).
                s("bc",cfg.TOPBARDIV_BCOL).a([
                    //////////////////////////////////////////////
                    new e("div").h(this.title).pa().o(this.PADDING,this.PADDING).                            
                        px("fs",this.BAR_WIDTH-2*this.PADDING),
                    //////////////////////////////////////////////
                    this.largetopbar=new e("div")
                    //////////////////////////////////////////////
                ]),
            //////////////////////////////////////////////
            new e("div").pa().s("bc",cfg.WIDGET_BCOL).
                r(this.PADDING,this.BAR_WIDTH+2*this.PADDING,this.width,this.height).a([
                    this.widgetdiv=new e("div").pa().
                        r(0,0,this.width,this.widgetHeight).s("bc",cfg.WIDGETDIV_BCOL),
                    this.contentdiv=new e("div").s("ovf","scroll").pa().
                        r(0,this.widgetHeight,this.width,this.height-this.widgetHeight)                    
                ]),
            //////////////////////////////////////////////
            this.bottombardiv=new e("div").pa().s("bc",cfg.BOTTOMBARDIV_BCOL).
                r(this.PADDING,this.BAR_WIDTH+this.height+3*this.PADDING,this.width,this.BOTTOM_BAR_WIDTH).a(
                    //////////////////////////////////////////////
                    this.buttons.map(bd=>
                        new Button(bd[0]).onClick(bd[1].bind(this)).
                        px("mgl",this.PADDING).px("mgt",this.PADDING).
                        px("h",this.BOTTOM_BAR_WIDTH-2*this.PADDING)
                    )
                    //////////////////////////////////////////////                    
                )
            //////////////////////////////////////////////
        ])      
        this.bottombardiv.a([
            this.dragSizeDiv=<DragDiv>new DragDiv().
                setLeft(this.width-this.DRAG_SIZE_DIV_WIDTH-this.PADDING).setTop(this.PADDING).
                setWidth(this.DRAG_SIZE_DIV_WIDTH).setHeight(this.BOTTOM_BAR_WIDTH-2*this.PADDING).
                setMouseMoveCallback(this.dragSizeMouseMoveCallback.bind(this)).
                setMouseUpCallback(this.dragSizeMouseUpCallback.bind(this)).
                setMoveDiv(true).
                s("bc",cfg.DRAGSIZEDIV_BCOL).a([                    
                    //////////////////////////////////////////////
                    this.dragSizeLargeTopBar=new e("div")
                    //////////////////////////////////////////////
                ])
        ])      
        this.topbardiv.setLargeTopBar(this.largetopbar).build()
        this.dragSizeDiv.setLargeTopBar(this.dragSizeLargeTopBar).build()
        return this
    }

    cancel(){
        this.ld.closeLayer(this.ldi)
    }

    totalHeight():number{return this.BAR_WIDTH+this.height+this.BOTTOM_BAR_WIDTH+4*this.PADDING}
    totalWidth():number{return this.width+2*this.PADDING}

    toJsonText():string{
        return JSON.stringify(this,["top","left","width","height"],1)
    }

    fromJson(json:any){        
        this.top=json.top || 0
        this.left=json.left || 0
        this.width=json.width || this.DEFAULT_WIDTH
        this.height=json.height || this.DEFAULT_HEIGHT
    }
}

class FileDialogWindow extends DraggableWindow{

    namedialogwindow:TextDialogWindow
    dirdialogwindow:TextDialogWindow

    setDefaultSize(){
        super.setDefaultSize()
        this.DEFAULT_WIDTH=Globals.cfg.FileDialogWindow.DEFAULT_WIDTH
        this.width=this.DEFAULT_WIDTH
    }

    selectDirectory(){
        this.cancel()
        this.parent.directorySelected(this.fcs)
    }

    createDirOk(){
        this.build()
    }

    createDirFailed(){

    }

    dirDialogOk(){        
        let dirname=this.dirdialogwindow.content
        let dirpath=this.fcs.abspath("")
        let createdirasset=new AjaxAsset({
            action:"createdir",
            path:dirpath,
            name:dirname
        })
        this.markedpath=undefined
        new AssetLoader().
            add(createdirasset).
            setcallback(this.createDirOk.bind(this)).
            seterrorcallback(this.createDirFailed.bind(this)).
            load()
    }

    renameDirOk(){
        this.build()
    }

    renameDirFailed(){
        
    }

    renamedirDialogOk(){                
        let dirname=this.dirdialogwindow.content        
        let currentdirname=this.upDir()
        if(currentdirname==undefined) return    
        let dirpath=this.fcs.abspath(currentdirname)    
        let newdirpath=this.fcs.abspath(dirname)
        let renamedirasset=new AjaxAsset({
            action:"renamefile",
            pathFrom:dirpath,
            pathTo:newdirpath
        })
        this.markedpath=undefined
        new AssetLoader().
            add(renamedirasset).
            setcallback(this.renameDirOk.bind(this)).
            seterrorcallback(this.renameDirFailed.bind(this)).
            load()
    }

    createDirectory(){
        this.dirdialogwindow=new TextDialogWindow(this.dirdialogId(),this.ld,this.ldi+1)
        this.dirdialogwindow.
            setOkCallBack(this.dirDialogOk.bind(this)).
            setTitle("Enter directory name").
            build()
    }

    createFileOk(){
        let name=this.dirdialogwindow.content
        let createpath=this.fcs.abspath(name)        
        
        let createasset=new AjaxAsset({
            action:"writetextfile",
            path:createpath,
            content:""
        })        
        new AssetLoader().
            add(createasset).
            setcallback(this.createOk.bind(this)).
            seterrorcallback(this.createFailed.bind(this)).
            load()
    }

    createOk(){
        this.build()
    }

    createFailed(){        
    }

    createFile(){
        this.dirdialogwindow=new TextDialogWindow(this.dirdialogId(),this.ld,this.ldi+1)
        this.dirdialogwindow.
            setOkCallBack(this.createFileOk.bind(this)).
            setTitle("Enter file name").
            build()
    }

    renameDirectory(){
        this.dirdialogwindow=new TextDialogWindow(this.dirdialogId(),this.ld,this.ldi+1)
        this.dirdialogwindow.
            setOkCallBack(this.renamedirDialogOk.bind(this)).
            setTitle("Enter directory name").
            build()
    }

    removeDirOk(){
        this.build()
    }

    removeDirFailed(){

    }

    deleteDirectory(){        
        let dirname
        if((dirname=this.upDir())!=undefined){
            let dirpath=this.fcs.abspath("")
            let removedirasset=new AjaxAsset({
                action:"removedir",
                path:dirpath,
                name:dirname
            })
            this.markedpath=undefined
            new AssetLoader().
                add(removedirasset).
                setcallback(this.removeDirOk.bind(this)).
                seterrorcallback(this.removeDirFailed.bind(this)).
                load()
        }
    }

    ajaxasset:AjaxAsset

    upDir():string{
        if(this.fcs.dirpathl.length==0) return undefined
        return this.fcs.dirpathl.pop()
    }

    fileNameClicked(file:any,e:Event){
        if(file.name==".."){
            if(this.upDir()!=undefined) this.build()
        }
        else if(file.isdir){
            this.fcs.dirpathl.push(file.name)
            this.build()
        } else if(file.isfile){
            this.fcs.name=file.name
            this.cancel()
            this.parent.directorySelected(this.fcs)
        }
    }

    markedaction:string

    toolSelected(file:any,tc:ComboBox,ev:Event){        
        let name=file.name
        let abspath=this.fcs.abspath(name)
        file.abspath=abspath
        let command=tc.selectedKey
        tc.build().selectByIndex(0)        
        switch(command){
            case "view":new FileView(file,this.ld,this.ldi+1).build();break
            case "edit":new FileView(file,this.ld,this.ldi+1).build();break
            case "copy":case "copyas":case "cut":case "cutas":case "rename":{
                this.markedpath=abspath
                this.markedname=name
                this.showMarkedPath()                
                let row=this.filegrid.getRowByColValue("name",name)
                this.filegrid.unMarkAllRows()
                this.filegrid.markRow(row)
                this.markedaction="copy"
                if((command=="cut")||(command=="cutas")) this.markedaction="cut"
                if(command=="rename") this.markedaction="rename"
                if((command=="copyas")||(command=="cutas")||(command=="rename")){
                    this.namedialogwindow=new TextDialogWindow(this.namedialogId(),this.ld,this.ldi+1)
                    this.namedialogwindow.
                        setOkCallBack(this.nameDialogOk.bind(this)).
                        setTitle("Enter file name").
                        build()
                }                
            };break
            case "delete":{
                new ConfirmDialogWindow(this.deleteConfirmDialogId(),this.ld,this.ldi+1).
                    setOkCallBack(this.deleteConfirmOk.bind(this)).
                    setContentInfo(`Are you sure you want to delete ${abspath}?`).
                    setTitle("Confirm delete").                    
                    build()
                this.deletepath=abspath                
            }
        }        
    }

    deletepath:string

    deleteConfirmOk(){
        this.deleteFile(this.deletepath)
    }

    deleteConfirmDialogId():string{return this.id+"_deleteconfirm"}

    deleteFile(path:string){
        let deleteasset=new AjaxAsset({
            action:"deletefile",
            path:path
        })
        this.markedpath=undefined
        new AssetLoader().
            add(deleteasset).
            setcallback(this.deleteOk.bind(this)).
            seterrorcallback(this.deleteFailed.bind(this)).
            load()
    }

    deleteOk(){
        this.build()
    }

    deleteFailed(){

    }

    nameDialogOk(){
        this.markedname=this.namedialogwindow.content
        let pastepath=this.fcs.abspath(this.markedname)        
        if(this.markedaction=="rename"){
            let pasteasset=new AjaxAsset({
                action:"renamefile",
                pathFrom:this.markedpath,
                pathTo:pastepath
            })
            this.markedpath=undefined
            new AssetLoader().
                add(pasteasset).
                setcallback(this.pasteOk.bind(this)).
                seterrorcallback(this.pasteFailed.bind(this)).
                load()
        }
        else this.showMarkedPath()
    }

    namedialogId():string{return this.id+"_namedialog"}
    dirdialogId():string{return this.id+"_dirdialog"}

    showMarkedPath(){                
        this.markedpathdiv.h("").a([
            new e("div").h(this.fcs.fullpath())
        ])
        if(this.markedpath!=undefined){
            this.markedpathdiv.a([
                new Button("Paste").onClick(this.pasteClicked.bind(this)),
                new e("span").h((this.markedaction=="copy"?"Copy":"Cut")+" "+this.markedpath+" as "+this.markedname)
            ])
        }
    }

    pasteClicked(e:Event){
        let pastepath=this.fcs.abspath(this.markedname)        
        let pasteasset=new AjaxAsset({
            action:this.markedaction=="copy"?"copyfile":"movefile",
            pathFrom:this.markedpath,
            pathTo:pastepath
        })
        this.markedpath=undefined
        new AssetLoader().
            add(pasteasset).
            setcallback(this.pasteOk.bind(this)).
            seterrorcallback(this.pasteFailed.bind(this)).
            load()
    }

    pasteOk(){
        this.build()
    }

    pasteFailed(){

    }

    ajaxok(){
        let json=this.ajaxasset.resjson        
        
        let files=json.files || []

        files.unshift({
            ok:true,
            name:"..",
            isdir:true,
            isfile:false,                
            parentdir:true,
            stats:{

            }
        })

        this.filegrid.clearItems()

        let cfg=Globals.cfg.FileDialogWindow

        let row=0
        files.map(file=>{
            file.isanydir=file.isdir||file.parentdir
            file.istruedir=file.isdir&&(!file.parentdir)
            let stats=file.stats
            let kind=`${file.isdir?"dir":""}${file.isfile?"file":""}`
            this.filegrid.setItem(new SortableGridIndex(row,"type"),new e("div").
                h(kind).k(kind)
            )
            this.filegrid.setItem(new SortableGridIndex(row,"name"),new e("div").
                h(file.name).k(file.name).s("cur","ptr").
                s("bc",file.istruedir?cfg.DIR_COL:"initial").
                px("pd",cfg.PADDING).                
                ae("md",this.fileNameClicked.bind(this,file))
            )
            let tc=new ComboBox().addOptions([
                    new ComboOption("tools","Tools"),
                    new ComboOption("view","View"),
                    new ComboOption("edit","Edit"),
                    new ComboOption("rename","Rename"),
                    new ComboOption("copy","Copy"),
                    new ComboOption("copyas","CopyAs"),
                    new ComboOption("cut","Cut"),
                    new ComboOption("cutas","CutAs"),                    
                    new ComboOption("delete","Delete")
                ])
            tc.onChange(this.toolSelected.bind(this,file,tc)).
                build()
            if((!file.parentdir)&&(file.isfile)) this.filegrid.setItem(new SortableGridIndex(row,"tools"),new e("div").
                a([
                    tc
                ])
            )
            this.filegrid.setItem(new SortableGridIndex(row,"modified"),new e("div").
                h(stats.mtime).k(stats.mtime)
            )
            this.filegrid.setItem(new SortableGridIndex(row,"size"),new e("div").
                h(file.isanydir?"":stats.size).k(stats.size).px("w",cfg.SIZE_WIDTH).
                s("text-align","right")
            )
            row++
        })

        this.filegrid.build()
    }

    ajaxfailed(){
        console.log("ajax failed")
    }

    listFiles(){                     
        let path=this.fcs.abspath("")
        this.ajaxasset=new AjaxAsset({
            action:"listdir",
            path:path
        })
        new AssetLoader().
            add(this.ajaxasset).
            setcallback(this.ajaxok.bind(this)).
            seterrorcallback(this.ajaxfailed.bind(this)).
            load()
    }

    filegrid:SortableGrid

    keys:SortableGridKey[]

    sortableGridId():string{return this.id+"_grid"}

    markedpathdiv:e
    markedpath:string
    markedname:string

    build():FileDialogWindow{   
        let cfg=Globals.cfg.FileDialogWindow

        this.setWidgetHeight(cfg.WIDGET_HEIGHT)
        super.build()           
        this.filegrid=new SortableGrid(this.sortableGridId())
        this.keys=[
            new SortableGridKey("type",this.filegrid),
            new SortableGridKey("name",this.filegrid),
            new SortableGridKey("tools",this.filegrid),
            new SortableGridKey("modified",this.filegrid),
            new SortableGridKey("size",this.filegrid)
        ]
        this.filegrid.setKeys(this.keys).setNumFixed(1).build()
        this.contentdiv.a([
            this.filegrid
        ])
        this.markedpathdiv=this.widgetdiv
        this.showMarkedPath()
        this.listFiles()
        return this
    }

    fcs:FileChooserState

    parent:FileChooser

    constructor(id:string,ld:LayeredDocument,i:number,fcs:FileChooserState,parent:FileChooser){
        super(id,ld,i)  
        this.fcs=fcs  
        this.parent=parent            
        this.buttons.push(["Select Directory",this.selectDirectory.bind(this)])
        this.buttons.push(["Create Directory",this.createDirectory.bind(this)])
        this.buttons.push(["Create File",this.createFile.bind(this)])
        this.buttons.push(["Rename Directory",this.renameDirectory.bind(this)])
        this.buttons.push(["Delete Directory",this.deleteDirectory.bind(this)])
    }
}

class TextDialogWindow extends DraggableWindow{
    textinput:TextInput

    content:string=""

    build():TextDialogWindow{
        let cfg=Globals.cfg.TextDialogWindow

        this.height=cfg.HEIGHT
        super.build()
        this.textinput.px("mgt",cfg.TEXTINPUT_PADDING).px("mgl",cfg.TEXTINPUT_PADDING)        
        this.contentdiv.h("").a([
            this.textinput
        ])
        setTimeout(((e)=>{
            this.textinput.focus()
        }).bind(this),cfg.FOCUS_TIMEOUT)        
        return this
    }

    okClicked(e:Event){
        this.content=this.textinput.getText()
        this.ld.closeLayer(this.ldi)
        if(this.okcallback!=undefined) this.okcallback()
    }

    setText(content:string):TextDialogWindow{
        this.textinput.setText(content)
        return this
    }

    textInputId():string{return this.id+"_textinput"}

    okcallback

    setOkCallBack(okcallback):TextDialogWindow{
        this.okcallback=okcallback
        return this
    }

    constructor(id:string,ld:LayeredDocument,i:number){
        super(id,ld,i) 
        
        this.textinput=new TextInput(this.textInputId())        
        
        this.buttons.push(["Ok",this.okClicked.bind(this)])
    }
}

class ConfirmDialogWindow extends DraggableWindow{
    contentinfo:string

    build():ConfirmDialogWindow{
        let cfg=Globals.cfg.ConfirmDialogWindow

        this.height=cfg.HEIGHT
        super.build()
        
        this.contentdiv.h("").a([
            new e("div").h(this.contentinfo).px("mg",cfg.CONTENT_MARGIN)
        ])
        
        return this
    }

    okClicked(e:Event){        
        this.ld.closeLayer(this.ldi)
        if(this.okcallback!=undefined) this.okcallback()
    }

    okcallback

    setContentInfo(contentinfo:string):ConfirmDialogWindow{
        this.contentinfo=contentinfo
        return this
    }

    setOkCallBack(okcallback):ConfirmDialogWindow{
        this.okcallback=okcallback
        return this
    }

    constructor(id:string,ld:LayeredDocument,i:number){
        super(id,ld,i) 
        
        this.buttons.push(["Ok",this.okClicked.bind(this)])
    }
}