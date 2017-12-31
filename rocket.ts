namespace Physics{
    export let G = 6.674E-11

    export let Me = 5.972E24

    export let Re = 6.371E6

    export function Fg(m1:number,m2:number,r:number):number{
        return G*m1*m2/(r*r)
    }

    export function Fge(m:number,r:number):number{
        return G*m*Me/(r*r)
    }

    export class Vector{
        x:number
        y:number
        constructor(x:number,y:number){
            this.x=x
            this.y=y
        }
        plus(v:Vector):Vector{
            return new Vector(this.x+v.x,this.y+v.y)
        }
        minus(v:Vector):Vector{
            return new Vector(this.x-v.x,this.y-v.y)
        }
        l():number{
            return Math.sqrt(this.x*this.x+this.y*this.y)
        }
        s(s:number):Vector{
            return new Vector(this.x*s,this.y*s)
        }
    }
}

class DrawCircle{
    x:number
    y:number
    r:number
    fill:string
    stroke:string
    constructor(x:number,y:number,r:number,fill:string,stroke:string){
        this.x=x
        this.y=y
        this.r=r
        this.fill=fill
        this.stroke=stroke
    }
}

class RocketCalculator extends e implements CustomElement<RocketCalculator>{
    table:e

    m:number=1000
    x:number=0
    y:number=Physics.Re
    vx:number=605
    vy:number=7310
    ts:number=1
    sts:number=10

    mtext:TextInput
    xtext:TextInput
    ytext:TextInput
    vxtext:TextInput
    vytext:TextInput
    tstext:TextInput
    ststext:TextInput
    stime:number

    circles:DrawCircle[]=[]

    reset(){
        this.circles=[]
    }

    constructor(){
        super("div")
    }

    display(){
        this.mtext.setText(""+this.m)
        this.xtext.setText(""+this.x)
        this.ytext.setText(""+this.y)
        this.vxtext.setText(""+this.vx)
        this.vytext.setText(""+this.vy)        
        this.tstext.setText(""+this.ts)        
        this.ststext.setText(""+this.sts)        
    }

    read(){
        this.m=parseFloat(this.mtext.getText())
        this.x=parseFloat(this.xtext.getText())
        this.y=parseFloat(this.ytext.getText())
        this.vx=parseFloat(this.vxtext.getText())
        this.vy=parseFloat(this.vytext.getText())
        this.ts=parseFloat(this.tstext.getText())
        this.sts=parseFloat(this.ststext.getText())
    }

    simon:boolean=false

    maxdist=0
    maxvabs=0

    simulate(){
        this.simon=!this.simon        

        if(this.simon){
            this.read()
        
            this.addCircle(0,0,Physics.Re)            
            this.drawsvg()

            this.stime=0

            this.maxdist=0
            this.maxvabs=0

            this.simulStep(null)
        }
    }

    GRAPH_WIDTH=600
    GRAPH_HEIGHT=600
    GRAPH_OFFSET_X=200
    GRAPH_OFFSET_Y=300

    SCALE_FACTOR=1

    GRAPH_SCALE(){return this.GRAPH_WIDTH/(4*Physics.Re)*this.SCALE_FACTOR}

    GRAPH_SCALE_X(){return this.GRAPH_SCALE()}
    GRAPH_SCALE_Y(){return this.GRAPH_SCALE()}

    x2sx(x:number){return x*this.GRAPH_SCALE_X()+this.GRAPH_OFFSET_X}
    y2sy(y:number){return -y*this.GRAPH_SCALE_Y()+this.GRAPH_OFFSET_Y}

    addCircle(x:number,y:number,r:number,fill:string="#aaf",stroke:string="#00f"){
        this.circles.push(new DrawCircle(x,y,r,fill,stroke))
    }

    circle(x:number,y:number,r:number,fill:string="#aaf",stroke:string="#00f"){
        this.svg.a([
            new e("circle").
                t("cx",""+this.x2sx(x)).
                t("cy",""+this.y2sy(y)).
                t("r",""+r*this.GRAPH_SCALE()).
                t("fill",fill).
                t("stroke",stroke)
        ])
    }

    drawsvg(){
        this.svg=new e("svg").
            t("width",""+this.GRAPH_WIDTH).
            t("height",""+this.GRAPH_HEIGHT)

        this.circles.map(dc=>{
            this.circle(dc.x,dc.y,dc.r,dc.fill,dc.stroke)
        })

        this.svgdiv.h(`
        <svg width="${this.GRAPH_WIDTH}" height="${this.GRAPH_HEIGHT}">
            ${this.svg.e.innerHTML}
        </svg>
        `)
    }

    simulStep(ev:Event){       

        let o=new Physics.Vector(this.x,this.y)

        if(o.l()<Physics.Re){
            this.simon=false
            return
        }

        let v=new Physics.Vector(this.vx,this.vy)

        let l=o.l()

        let gfabs=-Physics.Fge(this.m,l)

        let gf=new Physics.Vector(o.x/l,o.y/l).s(gfabs)

        let a=gf.s(1/this.m)

        let no=o.plus(v.s(this.ts))

        let nv=v.plus(a.s(this.ts))        
        
        this.x=no.x
        this.y=no.y

        this.vx=nv.x
        this.vy=nv.y  

        let dist=no.l()-Physics.Re

        let vabs=nv.l()

        if(dist>this.maxdist) this.maxdist=dist
        if(vabs>this.maxvabs) this.maxvabs=vabs

        let travel=(Math.PI/2-Math.atan(no.y/no.x))*Physics.Re
        
        this.infodiv.h(`
<pre>
dist    :  ${(dist/1000).toLocaleString()} km<br>
maxdist :  ${(this.maxdist/1000).toLocaleString()} km<br>
vabs    :  ${vabs.toLocaleString()} m/s<br>
maxvabs :  ${this.maxvabs.toLocaleString()} m/s<br>
travel  :  ${(travel/1000).toLocaleString()} km<br>            
time    :  ${this.stime} s<br>
</pre>
        `).px("w",250).px("mg",15)                

        this.display()        

        if(dist<=0) this.simon=false

        if(((this.stime%50)==0)||(!this.simon)){
            this.addCircle(no.x,no.y,150000,"#ff0","#000")
            this.drawsvg()
        }

        this.stime+=this.ts

        if(this.simon){
            this.simulbutton.e["value"]="Stop simulation"
            setTimeout(this.simulStep.bind(this),this.sts)
        }else{
            this.simulbutton.e["value"]="Simulate"
        }
    }

    infodiv:e
    svgdiv:e
    svg:e

    simulbutton:Button

    build():RocketCalculator{
        this.table=new e("table")
        this.mtext=new TextInput()
        this.xtext=new TextInput()
        this.ytext=new TextInput()
        this.vxtext=new TextInput()
        this.vytext=new TextInput()
        this.tstext=new TextInput()
        this.ststext=new TextInput()

        this.table.px("bs",3).s("bcs","separate").a([
            new e("tr").a([
                new e("td").a([new e("div").h("m")]),
                new e("td").a([this.mtext])
            ]),
            new e("tr").a([
                new e("td").a([new e("div").h("x")]),
                new e("td").a([this.xtext])
            ]),
            new e("tr").a([
                new e("td").a([new e("div").h("y")]),
                new e("td").a([this.ytext])
            ]),
            new e("tr").a([
                new e("td").a([new e("div").h("vx")]),
                new e("td").a([this.vxtext])
            ]),
            new e("tr").a([
                new e("td").a([new e("div").h("vy")]),
                new e("td").a([this.vytext])
            ]),
            new e("tr").a([
                new e("td").a([new e("div").h("ts")]),
                new e("td").a([this.tstext])
            ]),
            new e("tr").a([
                new e("td").a([new e("div").h("sts")]),
                new e("td").a([this.ststext])
            ]),
            new e("tr").a([                
                new e("td").t("colspan","2").a([
                    <Button>new Button("+").
                        onClick(this.zoom.bind(this,1.2)).
                        px("mg",10),
                    <Button>new Button("-").
                        onClick(this.zoom.bind(this,0.8)).
                        px("mg",10),
                    this.simulbutton=<Button>new Button("Simulate").
                    onClick(this.simulate.bind(this)).
                    px("mg",10)
                ])
            ])
        ])

        this.h("").a([
            new e("table").px("bs",5).s("bcs","separate").px("mg",5).
            s("ff","ms").a([
                new e("tr").a([
                    new e("td").s("vertical-align","top").a([
                        this.table,
                        this.infodiv=new e("div").s("ff","ms")
                    ]),
                    new e("td").a([
                        this.svgdiv=new e("div").
                            z(this.GRAPH_WIDTH,this.GRAPH_HEIGHT)
                    ])
                ])
            ])
        ])

        this.display()
        
        return this
    }

    zoom(factor:number,e:Event){
        this.SCALE_FACTOR*=factor
        this.drawsvg()
    }
}