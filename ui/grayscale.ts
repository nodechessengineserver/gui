class GrayScale extends e implements CustomElement<GrayScale>{
    imgdiv:e

    pixels:number[]

    constructor(){
        super("div")
        this.pixels=new Array(this.AREA())
    }

    AREA(){return this.WIDTH_PIXEL()*this.HEIGHT_PIXEL()}
    PIXEL_WIDTH(){return Globals.cfg.GrayScale.PIXEL_WIDTH}
    HEIGHT_PIXEL(){return Globals.cfg.GrayScale.HEIGHT_PIXEL}
    WIDTH_PIXEL(){return Globals.cfg.GrayScale.WIDTH_PIXEL}

    totalImgWidth(){return this.PIXEL_WIDTH()*this.WIDTH_PIXEL()}
    totalImgHeight(){return this.PIXEL_WIDTH()*this.HEIGHT_PIXEL()}

    fromData(data:any):GrayScale{
        this.pixels=data[0]
        return this
    }

    randClicked(e:Event){
        let data=Globals.neural
        let size=data.length
        let r=Math.floor(Math.random()*size)
        this.fromData(data[r])
        this.build()
    }

    build():GrayScale{
        this.imgdiv=new e("div").pr().z(this.totalImgWidth(),this.totalImgHeight())        

        for(let r=0;r<this.HEIGHT_PIXEL();r++){
            for(let c=0;c<this.WIDTH_PIXEL();c++){
                let pdiv=new e("div").pa().r(
                    c*this.PIXEL_WIDTH(),
                    r*this.PIXEL_WIDTH(),
                    this.PIXEL_WIDTH(),
                    this.PIXEL_WIDTH()
                ).s("bc",Misc.grayScaleToRgb(this.pixels[r*this.WIDTH_PIXEL()+c]))
                this.imgdiv.a([
                    pdiv
                ])
            }
        }

        this.h("").z(this.totalImgWidth(),this.totalImgHeight()).px("pd",2).s("bc","#00f").a([
            this.imgdiv/*,
            new Button("Rand").onClick(this.randClicked.bind(this)).px("mg",10)*/
        ])

        return this
    }
}

class DigitEditor extends e implements CustomElement<DigitEditor>{
    imgdiv:e

    pixels:number[]

    constructor(){
        super("table")
        this.pixels=new Array(this.AREA())
    }

    recognizeCallback

    setRecognizeCallback(recognizeCallback):DigitEditor{
        this.recognizeCallback=recognizeCallback
        return this
    }

    AREA(){return this.WIDTH_PIXEL()*this.HEIGHT_PIXEL()}
    PIXEL_WIDTH(){return Globals.cfg.DigitEditor.PIXEL_WIDTH}
    HEIGHT_PIXEL(){return Globals.cfg.DigitEditor.HEIGHT_PIXEL}
    WIDTH_PIXEL(){return Globals.cfg.DigitEditor.WIDTH_PIXEL}

    totalImgWidth(){return this.PIXEL_WIDTH()*this.WIDTH_PIXEL()}
    totalImgHeight(){return this.PIXEL_WIDTH()*this.HEIGHT_PIXEL()}

    fromData(data:any):DigitEditor{
        this.pixels=data[0]
        return this
    }

    clearClicked(e:Event){
        for(let i=0;i<this.AREA();i++){
            this.pixels[i]=0
        }
        this.down=false
        this.build()
    }

    down=false

    imgMouseDown(e:Event){        
        this.down=true
        this.imgMouseMove(e)
    }

    imgMouseMove(e:Event){
        if(!this.down) return
        let me=<MouseEvent>e
        let cr=this.imgdiv.e.getBoundingClientRect()
        let imgorig=new Vectors.Vect(cr.left,cr.top)
        let mousepos=new Vectors.Vect(me.clientX,me.clientY)
        let relpos=mousepos.m(imgorig).s(1/this.PIXEL_WIDTH())
        let x=Math.floor(relpos.x)
        let y=Math.floor(relpos.y)
        let i=x+y*this.WIDTH_PIXEL() 
        this.pixels[i]=1               
        this.build()
    }

    imgMouseUp(e:Event){
        this.down=false
    }

    imgMouseOut(e:Event){
        this.down=false
    }

    recognizeClicked(e:Event){
        this.down=false
        this.recognizeCallback()
    }

    resultdiv:e

    build():DigitEditor{
        this.imgdiv=new e("div").pr().z(this.totalImgWidth(),this.totalImgHeight()).
        ae("mousedown",this.imgMouseDown.bind(this)).
        ae("mousemove",this.imgMouseMove.bind(this)).
        ae("mouseup",this.imgMouseUp.bind(this)).
        ae("mouseout",this.imgMouseOut.bind(this))            

        for(let r=0;r<this.HEIGHT_PIXEL();r++){
            for(let c=0;c<this.WIDTH_PIXEL();c++){
                let pdiv=new e("div").pa().r(
                    c*this.PIXEL_WIDTH(),
                    r*this.PIXEL_WIDTH(),
                    this.PIXEL_WIDTH(),
                    this.PIXEL_WIDTH()
                ).s("bc",Misc.grayScaleToRgb(this.pixels[r*this.WIDTH_PIXEL()+c])).
                ae("mouseout",(e:Event)=>{e.stopPropagation()})
                this.imgdiv.a([
                    pdiv
                ])
            }
        }

        this.px("bs",3).s("bcs","separate").h("").z(this.totalImgWidth(),this.totalImgHeight()).px("pd",4).s("bc","#aaa").a([
            new e("tr").a([
                new e("td").a([
                    this.imgdiv,
                    new Button("Clear").onClick(this.clearClicked.bind(this)).px("mg",10),
                    new Button("Recognize").onClick(this.recognizeClicked.bind(this)).px("mg",10)
                ]),
                new e("td").s("vertical-align","top").a([
                    this.resultdiv=new e("div").px("fs",220).z(160,200).px("mgl",50)
                ])
            ])
        ])

        return this
    }
}