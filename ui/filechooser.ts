class FileChooser extends e implements CustomElement<FileChooser>{
    ld:LayeredDocument
    li:number

    constructor(id:string,ld:LayeredDocument,li:number){
        super("table",id) 
        this.ld=ld
        this.li=li
        this.state=new FileChooserState(this.fileChooserStateId())               
        this.state.fromStored()
    }

    fileChooserStateId():string{return this.id+"_state"}
    driveButtonId():string{return this.id+"_drive"}    

    state:FileChooserState

    directorySelected(fcs:FileChooserState){
        this.state=fcs
        this.build()
    }

    selectButtonClicked(){
        let cstate=new FileChooserState(this.fileChooserStateId())
        cstate.copyFrom(this.state)
        new FileDialogWindow("File",this.ld,this.li,cstate,this).
            setTitle("Select file / directory").            
            build()
    }

    driveDialogId():string{return this.id+"_drivedialog"}

    driveDialog:TextDialogWindow

    driveEdited(e:Event){
        this.state.drive=this.driveDialog.content
        this.build()
    }

    driveButtonClicked(e:Event){
        this.driveDialog=new TextDialogWindow(this.driveDialogId(),this.ld,this.li).
            setOkCallBack(this.driveEdited.bind(this)).
            setText(this.state.drive)
        this.driveDialog.
            setTitle("Enter drive").
            build()
    }

    build():FileChooser{          
        let cfg=Globals.cfg.FileChooser      
        this.px("bs",cfg.TABLE_BS).s("bcs","separate").h().a([
            new e("tr").a([
                new e("td").a([
                    new Button(this.state.drive).onClick(this.driveButtonClicked.bind(this)).
                    onClick(this.driveButtonClicked.bind(this))
                ]),
                new e("td").s("ff","ms").a([
                    new e("div").px("w",cfg.PATH_WIDTH).s("ovf","hidden").s("text-align","left").
                    s("text-overflow","ellipsis").s("direction","rtl").
                        h(this.state.fullpath())
                ]),
                new e("td").a([
                    new Button("...").onClick(this.selectButtonClicked.bind(this))
                ]),
                new e("td").a([                    
                    new Button(this.state.name).
                    onClick(this.nameButtonClicked.bind(this))
                ])
            ])
        ])
        this.state.store()
        return this
    }

    nameDialogId():string{return this.id+"_namedialog"}

    nameDialog:TextDialogWindow
    
    nameEdited(e:Event){
        this.state.name=this.nameDialog.content
        this.build()
    }

    nameButtonClicked(e:Event){
        this.nameDialog=new TextDialogWindow(this.nameDialogId(),this.ld,this.li).
            setOkCallBack(this.nameEdited.bind(this)).
            setText(this.state.name)
        this.nameDialog.
            setTitle("Enter file name").
            build()
    }
}

