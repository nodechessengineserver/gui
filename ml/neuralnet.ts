class TrainLoader{
    label:string
    max:number

    constructor(label:string,max:number){
        this.label=label
        this.max=max
    }

    currentI:number=0
    neurals=[]
    neuralAsset:TextAsset

    loadIOk(){

        this.neurals.push(this.neuralAsset.asJson())

        this.currentI++

        if(this.currentI<this.max) setTimeout(this.loadI.bind(this),5000)

    }
    
    loadI():TrainLoader{
        this.neuralAsset=new TextAsset(`assets/neural2/${this.label}/${this.label}.${this.currentI}.json`)

        new AssetLoader().            
            add(this.neuralAsset).    
            setcallback(this.loadIOk.bind(this)).
            load()
        
        return this
    }

}

class Neuron{   
    ////////////////////////////
    bias:number=0
    a:number=0
    ////////////////////////////

    selected:boolean=false
    selectedfor:string
    div:e

    setBias(bias:number):Neuron{
        this.bias=bias
        return this
    }

    setActivation(a:number):Neuron{
        this.a=a
        return this
    }
}

class Layer{
    ////////////////////////////
    neurons:Neuron[]=[]
    ////////////////////////////

    margin:number
    spacing:number

    constructor(){        
    }

    get length(){
        return this.neurons.length
    }

    add(n:Neuron):Layer{
        this.neurons.push(n)
        return this
    }
}

class Weight{
    ////////////////////////////
    w:number=0
    ////////////////////////////

    constructor(w:number=0){
        this.w=w
    }
}

class WeightIndex{
    ////////////////////////////
    fromLayerIndex:number
    fromNeuronIndexIndex:number
    toLayerIndex:number
    toNeuronIndex:number
    ////////////////////////////

    constructor(fromLayerIndex:number,fromNeuronIndexIndex:number,toLayerIndex:number,toNeuronIndex:number){
        this.fromLayerIndex=fromLayerIndex
        this.fromNeuronIndexIndex=fromNeuronIndexIndex
        this.toLayerIndex=toLayerIndex
        this.toNeuronIndex=toNeuronIndex
    }

    key():string{
        return `${this.fromLayerIndex},${this.fromNeuronIndexIndex},${this.toLayerIndex},${this.toNeuronIndex}`
    }
}

class LayerConfigItem extends e{
    nInput:TextInput
    marginInput:TextInput
    spacingInput:TextInput
    constructor(n:number,margin:number,spacing:number){
        super("table")
        this.px("bs",2).s("bcs","separate").a([new e("tr").a([
            new e("td").h("n:"),
            new e("td").a([
                this.nInput=<TextInput>new TextInput().setText(""+n).px("w",30)
            ]),
            new e("td").px("pdl",5).px("fs",10).h("margin:"),
            new e("td").a([
                this.marginInput=<TextInput>new TextInput().setText(""+margin).px("w",30)
            ]),
            new e("td").px("pdl",5).px("fs",10).h("spacing:"),
            new e("td").a([
                this.spacingInput=<TextInput>new TextInput().setText(""+spacing).px("w",30)
            ])
        ])])
    }
}

class NeuralNet extends e implements CustomElement<NeuralNet>{
    ////////////////////////////

        ////////////////////////////
        // network        
        sizes:number[]=[]
        weights=[]
        biases=[]
        activations=[]
        zs=[]
        ////////////////////////////

    cons:{[id:string]:Weight}={}

    layers:Layer[]=[]

    config:any={}
    ////////////////////////////

    cfg:any

    neurondiv:e
    layerdiv:e
    netdiv:e

    opselector:RadioButtons
    fc:FileChooser
    grayscale:GrayScale    
    digiteditor:DigitEditor

    ld:LayeredDocument
    li:number

    graphdiv:e
    editordiv:e
    configdiv:e
    layerconfig:EditableList<LayerConfigItem>
    jsondiv:e
    tabs:TabPane

    configtextarea:TextArea

    errorLabel:e

    trainloader:TrainLoader
    validationloader:TrainLoader

    layerConfigApplyCallback(){        
        this.config.layers=this.layerconfig.list.map(item=>({
            n:parseInt(item.nInput.getText()),
            margin:parseInt(item.marginInput.getText()),
            spacing:parseInt(item.spacingInput.getText())
        }))
        this.setConfig(this.config).build()
        this.tabs.selectByKey("config")
    }

    layerMargin(layerIndex:number){
        let m=this.config.layers[layerIndex].margin
        return m==undefined?0:m
    }

    layerSpacing(layerIndex:number){
        let s=this.config.layers[layerIndex].spacing
        return s==undefined?1:s
    }

    setConfig(config:any):NeuralNet{
        this.config=config
        this.layers=[]
        this.cons={}
        for(let i=0;i<config.layers.length;i++){
            let cl=config.layers[i]
            this.createLayer(i,cl.n)            
        }
        return this
    }

    constructor(id:string,ld:LayeredDocument,li:number){
        super("div",id)
        this.ld=ld
        this.li=li
        this.setConfig({
            eta:0.01,
            lambda:0.000001,
            showWeights:false,
            layers:[
                {
                    n:196
                },
                {
                    n:40
                },
                {
                    n:10
                }
            ]
        })
    }

    nCoords(layerIndex:number,neuronIndex:number):Vectors.ScreenVector{
        return new Vectors.ScreenVector(
            layerIndex*this.cfg.NEURON_WIDTH,
            neuronIndex*this.cfg.NEURON_HEIGHT*this.layerSpacing(layerIndex)+
                this.layerMargin(layerIndex)*this.cfg.NEURON_HEIGHT
        )
    }

    nmCoords(layerIndex:number,neuronIndex:number):Vectors.ScreenVector{
        let c=this.nCoords(layerIndex,neuronIndex)
        return new Vectors.ScreenVector(
            c.x+this.cfg.NEURON_MLEFT+this.cfg.NEURON_DIAMETER/2,
            c.y+this.cfg.NEURON_MTOP+this.cfg.NEURON_DIAMETER/2
        )
    }

    nmCoordsEmit(layerIndex:number,neuronIndex:number):Vectors.ScreenVector{
        let c=this.nmCoords(layerIndex,neuronIndex)
        return new Vectors.ScreenVector(
            c.x+this.cfg.NEURON_DIAMETER/2,
            c.y
        )
    }

    nmCoordsReceive(layerIndex:number,neuronIndex:number):Vectors.ScreenVector{
        let c=this.nmCoords(layerIndex,neuronIndex)
        return new Vectors.ScreenVector(
            c.x-this.cfg.NEURON_DIAMETER/2,
            c.y
        )
    }

    getWeight(fromLayerIndex:number,fromNeuronIndexIndex:number,
        toLayerIndex:number,toNeuronIndex:number):Weight{
        return this.cons[new WeightIndex(fromLayerIndex,fromNeuronIndexIndex,
            toLayerIndex,toNeuronIndex).key()]
    }

    setWeight(fromLayerIndex:number,fromNeuronIndexIndex:number,
        toLayerIndex:number,toNeuronIndex:number,w:Weight){
        let key=new WeightIndex(fromLayerIndex,fromNeuronIndexIndex,
            toLayerIndex,toNeuronIndex).key()        
        if(w!=null) this.cons[key]=w
        else delete this.cons[key]
    }

    getNeuron(layerIndex:number,neuronIndex:number):Neuron{
        let neuron=this.layers[layerIndex].neurons[neuronIndex]
        if(this.activations.length<layerIndex) return neuron
        neuron.setActivation(Misc.getMathIJ(this.activations,layerIndex,neuronIndex))
        neuron.setBias(Misc.getMathIJ(this.biases,layerIndex-1,neuronIndex))
        return neuron
    }

    neuronClicked(layerIndex:number,neuronIndex:number,e:Event){
        let neuron=this.layers[layerIndex].neurons[neuronIndex]        

        if(this.opselector.selectedIndex>=0){
            neuron.selected=!neuron.selected
            let button=this.opselector.buttons[this.opselector.selectedIndex]
            neuron.selectedfor=button.key
            let sbcol=button.bcol
            let bcol=neuron.selected?sbcol:this.cfg.NEURON_BCOL
            neuron.div.s("bc",bcol)
        }
    }

    iterateCons(iterfunc:(
        fromLayerIndex:number,fromLayer:Layer,fromNeuronIndex:number,fromNeuron:Neuron,
        toLayerIndex:number,toLayer:Layer,toNeuronIndex:number,toNeuron:Neuron
    )=>void){
        for(let fromLayerIndex=0;fromLayerIndex<this.layers.length;fromLayerIndex++){
            let fromLayer=this.layers[fromLayerIndex]
            for(let fromNeuronIndex=0;fromNeuronIndex<fromLayer.length;fromNeuronIndex++){
                for(let toLayerIndex=0;toLayerIndex<this.layers.length;toLayerIndex++){
                    let toLayer=this.layers[toLayerIndex]
                    for(let toNeuronIndex=0;toNeuronIndex<toLayer.length;toNeuronIndex++){
                        let fromNeuron=fromLayer.neurons[fromNeuronIndex]
                        let toNeuron=toLayer.neurons[toNeuronIndex]
                        iterfunc(
                            fromLayerIndex,fromLayer,fromNeuronIndex,fromNeuron,
                            toLayerIndex,toLayer,toNeuronIndex,toNeuron
                        )                        
                    }
                }
            }
        }
    }

    clearSelections(){
        this.iterateNeurons((layerIndex,neuronIndex,neuron)=>{
            neuron.selected=false
        })
    }

    clearSelectionsClicked(e:Event){
        this.clearSelections()
        this.build()
    }

    connectClicked(on:boolean,e:Event){        
        this.iterateCons(
            (fromLayerIndex,fromLayer,fromNeuronIndex,fromNeuron,
            toLayerIndex,toLayer,toNeuronIndex,toNeuron)=>{
                if(fromNeuron.selected&&toNeuron.selected&&
                (fromNeuron.selectedfor=="from")&&(toNeuron.selectedfor=="to"))                        
                    this.setWeight(fromLayerIndex,fromNeuronIndex,toLayerIndex,toNeuronIndex,
                        on?new Weight(1):null)                        
            }
        )

        this.clearSelectionsClicked(null)
    }    

    layerClicked(layerIndex:number,e:Event){
        if(this.opselector.selectedIndex>=0){
            let l=this.layers[layerIndex]
            for(let neuronIndex=0;neuronIndex<l.length;neuronIndex++){
                this.neuronClicked(layerIndex,neuronIndex,null)
            }
        }
    }

    iterateNeurons(iterfunc:(layerIndex:number,neuronIndex:number,neuron:Neuron)=>void){
        for(let layerIndex=0;layerIndex<this.layers.length;layerIndex++){
            let l=this.layers[layerIndex]
            for(let neuronIndex=0;neuronIndex<l.length;neuronIndex++){
                let neuron=l.neurons[neuronIndex]
                iterfunc(layerIndex,neuronIndex,neuron)
            }
        }
    }

    toJsonText(){
        return JSON.stringify(this,(key,value)=>{
            if(["id","key","e","selected","div","selectedfor","netdiv","graphdiv","neurondiv",
                "layerdiv","ld","li","cfg","opselector","fc","jsondiv","tabs","configdiv",
                "configtextarea","errorLabel","error_squared","layerconfig","trainloader",
                "validationloader","editordiv"]
            .indexOf(key)<0){
                return value            
            }
            else return undefined
        },2)
    }

    showJson(content:string){
        this.jsondiv.h(`<pre>${content}</pre>`)
    }

    saveClicked(e:Event){
        let path=this.fc.state.abspath()
        let content=this.toJsonText()        
        new AjaxRequest({
            action:"writetextfile",
            path:path,
            content:content
        },()=>{
            this.showJson(content)
            this.tabs.selectByKey("json")
        })
    }

    fromJson(json:any){
        this.layers=[]
        this.cons={}

        for(let layerIndex in json.layers){
            let l=new Layer()
            this.layers.push(l)
            json.layers[layerIndex].neurons.map(neuron=>l.add(new Neuron().
                setBias(neuron.bias).
                setActivation(neuron.a)
            ))
        }

        for(let id in json.cons){
            let jsonw=json.cons[id]
            this.cons[id]=new Weight(jsonw.w)
        }

        this.config=json.config

        this.sizes=json.sizes

        this.weights=[]
        for(let i=0;i<json.weights.length;i++){
            let data=json.weights[i].data||json.weights[i]._data            
            this.weights.push(math.matrix(data))
        }

        this.biases=[]
        for(let i=0;i<json.biases.length;i++){
            let data=json.biases[i].data||json.biases[i]._data
            this.biases.push(math.matrix(data))
        }

        this.build()
    }

    fromJsonText(jsontext:string){
        this.fromJson(JSON.parse(jsontext))
    }

    loadClicked(e:Event){
        let path=this.fc.state.abspath()
        new AjaxRequest({
            action:"readtextfile",
            path:path
        },(ok,result)=>{            
            if(ok){                
                if(!result.error){
                    let content=result.content
                    this.showJson(content)
                    this.fromJsonText(content)                    
                }                
            }
        })
    }

    getInputLayer():Layer{return this.layers[0]}
    
    randomInputs(){        
        for(let n of this.getInputLayer().neurons){
            n.a=Misc.randLabel()
        }
    }

    configApplyClicked(e:Event){
        let configtext=this.configtextarea.getText()
        let config=JSON.parse(configtext)
        this.setConfig(config)
        this.build()
        this.tabs.selectByKey("graph")
    }

    tabsId():string{return this.id+"_tabs"}

    createLayer(index:number,size:number):NeuralNet{
        let l=new Layer()
        for(let i=0;i<size;i++) l.add(new Neuron())
        this.layers[index]=l        
        return this
    }

    errorStr(){
        if(this.error_squared==null) return "?"
        return JSON.stringify(this.error_squared._data)+" "+this.epochIndex+" : "+this.setI
    }

    layerConfigFactory(){
        return new LayerConfigItem(1,0,1)
    }

    getInputActivationArray():number[]{
        let a=this.activations.length>0?this.activations[0]:math.matrix().resize([this.config.layers[0].n,1])        
        let array=Misc.getData(a).map(row=>row[0])
        return array
    }

    recognize(){
        let vd=[this.digiteditor.pixels]
        this.validationInfo={n:0,ok:0}
        this.validate(vd)
        let d=this.validationInfo.y[0][0]
        this.digiteditor.resultdiv.h(""+d)
    }

    buildDivs(cfg:any){
        if(this.tabs==undefined){
            this.neurondiv=new e("div").pr()
            this.layerdiv=new e("div").pr()
            this.netdiv=new e("div").pr()
            this.graphdiv=new e("div").pr()
            this.editordiv=new e("div").pr()
            this.configdiv=new e("div").pr()
            this.layerconfig=new EditableList<LayerConfigItem>().
                setApplyCallback(this.layerConfigApplyCallback.bind(this)).
                setFactory(this.layerConfigFactory).
                setTitle(new e("div").
                    px("pd",5).
                    s("bc","#afa").
                    h("Layer configuration")
                ).
                setIndexDecorator(i=>`<font size="1">Layer ${i}.</font>`)
        }

        this.neurondiv.h("").z(
            cfg.NEURON_WIDTH*cfg.MAX_NUM_LAYERS,
            cfg.NEURON_HEIGHT*cfg.MAX_LAYER_SIZE
        ).s("bc",cfg.NEURALNET_BCOL).pr()

        this.layerdiv.h("").z(
            cfg.NEURON_WIDTH*cfg.MAX_NUM_LAYERS,
            cfg.LAYERDIV_HEIGHT
        ).s("bc",cfg.LAYERDIV_BCOL).pr()

        this.netdiv.h("").z(
            cfg.NEURON_WIDTH*cfg.MAX_NUM_LAYERS,
            cfg.NETDIV_HEIGHT
        ).s("bc",cfg.NETDIV_BCOL).pr()

        this.opselector=new RadioButtons().setButtons([
            new RadioButton("from","From",cfg.OPSELECTOR_FROMCOL),
            new RadioButton("to","To",cfg.OPSELECTOR_TOCOL)
        ])

        this.fc=new FileChooser("netfc",this.ld,this.li)

        this.netdiv.a([
            new e("table").px("bs",cfg.NETDIV_BS).s("bcs","separate").a([
                new e("tr").a([
                    new e("td").a([
                        this.opselector.build()                        
                    ]),
                    new e("td").a([
                        new Button("Connect").onClick(this.connectClicked.bind(this,true)),
                        new Button("Disconnect").onClick(this.connectClicked.bind(this,false)),
                        new Button("Clear").onClick(this.clearSelectionsClicked.bind(this))                        
                    ]),
                    new e("td").a([                                                
                        new Button("Save").onClick(this.saveClicked.bind(this)),
                        new Button("Load").onClick(this.loadClicked.bind(this)),
                        new Button("Init").onClick(this.initClicked.bind(this)),
                        new Button("BackProp").onClick(this.backPropClicked.bind(this,1)),
                        new Button("BackProp1000").onClick(this.backPropClicked.bind(this,1000)),
                        new Button("Train25").onClick(this.trainClicked.bind(this,25)),
                        new Button("Train250").onClick(this.trainClicked.bind(this,250))
                    ])
                ]),
                new e("tr").a([
                    new e("td").t("cs","2").a([
                        this.fc.build()
                    ]),
                    new e("td").a([
                        this.errorLabel=new e("label").h(this.errorStr())
                    ])
                ]),
                new e("tr").a([
                    new e("td").a([
                        this.grayscale=new GrayScale().fromData([this.getInputActivationArray()]).build()
                    ]),
                    new e("td").s("vertical-align","middle").a([
                        new e("div").h(JSON.stringify(this.logicout))
                    ]),
                    new e("td").s("vertical-align","middle").a([
                        new Button("ValidateOne").onClick(this.validateClicked.bind(this,1)),                       
                        new Button("Validate").onClick(this.validateClicked.bind(this,10)),
                        new e("div").h(JSON.stringify(this.validationInfo)).s("float","right")
                    ]),
                ])
            ])            
        ])

        this.digiteditor=<DigitEditor>new DigitEditor().
            fromData([this.getInputActivationArray()]).
            setRecognizeCallback(this.recognize.bind(this)).
            build().px("mg",10)

        this.graphdiv.h("").a([
            this.netdiv,
            this.layerdiv,
            this.neurondiv
        ])        

        this.editordiv.h("").a([
            this.digiteditor
        ])        

        this.configdiv.h("").a([
            new Button("Apply").
            onClick(this.configApplyClicked.bind(this)),
            new e("br"),
            this.configtextarea=new TextArea()            
        ])

        this.configtextarea.
            setText(JSON.stringify(this.config,null,2)).
            z(cfg.CONFIGTEXT_WIDTH,cfg.CONFIGTEXT_HEIGHT)

        let layerConfigList=this.config.layers.map(layer=>{
            return new LayerConfigItem(layer.n,layer.margin||0,layer.spacing||1)
        })

        this.layerconfig.setList(layerConfigList).build()

        if(this.tabs==undefined){
            this.jsondiv=new e("div").s("ff","ms")
            this.tabs=new TabPane(this.tabsId()).
                setWidth(cfg.TABS_WIDTH).
                setHeight(cfg.TABS_HEIGHT).
                setTabs([
                    new Tab("graph","Graph",this.graphdiv),
                    new Tab("editor","Editor",this.editordiv),
                    new Tab("config","Config",this.configdiv),
                    new Tab("layerconfig","LayerConfig",this.layerconfig),
                    new Tab("json","JSON",this.jsondiv)
                ]).build()
            this.a([this.tabs])
        }
    }

    buildNeurons(cfg:any){
        for(let layerIndex=0;layerIndex<this.layers.length;layerIndex++){
            let l=this.layers[layerIndex]  

            this.layerdiv.a([
                new e("div").pa().s("bc",cfg.LAYERLABEL_BCOL).s("cur","ptr").r(
                    layerIndex*cfg.NEURON_WIDTH+cfg.LAYERLABEL_MLEFT,cfg.LAYERLABEL_MTOP,
                    cfg.LAYERLABEL_WIDTH,cfg.LAYERLABEL_HEIGHT
                ).a([
                    new e("div").px("mg",cfg.LAYER_MARGIN).h(`Layer ${layerIndex+1}`).
                    ae("mousedown",this.layerClicked.bind(this,layerIndex))
                ])
            ])

            for(let neuronIndex=0;neuronIndex<l.length;neuronIndex++){
                let neuron=this.getNeuron(layerIndex,neuronIndex)
                let neuronCoords=this.nCoords(layerIndex,neuronIndex)

                let neuronDiv=new e("div").pa().r(
                    neuronCoords.x,neuronCoords.y,
                    cfg.NEURON_WIDTH,cfg.NEURON_HEIGHT
                ).s("bc",cfg.NEURON_BCOL)

                let neuronColor=Misc.signedRgb((neuron.a-cfg.NEURON_SHIFT)*cfg.NEURON_COLOR_FACTOR)

                let neuronCircleDiv=new e("div").pa().s("cur","ptr").s("bc",cfg.NEURON_BCOL).r(
                    cfg.NEURON_MLEFT,cfg.NEURON_MTOP,
                    cfg.NEURON_DIAMETER,cfg.NEURON_DIAMETER
                ).h(Misc.circleSvg(cfg.NEURON_DIAMETER,neuronColor,neuronColor)).
                ae("mousedown",this.neuronClicked.bind(this,layerIndex,neuronIndex))                

                let biasVector=new Vectors.Vect(0,-cfg.NEURON_DIAMETER/2).
                    r(Misc.normLin(neuron.bias,cfg.BIAS_NORMALIZATION)/cfg.BIAS_NORMALIZATION/1.25)

                let neuronMiddle=new Vectors.ScreenVector(cfg.NEURON_DIAMETER/2,cfg.NEURON_DIAMETER/2)

                let biasVectorTo=neuronMiddle.Plus(new Vectors.ScreenVector(biasVector.x,biasVector.y))

                if(layerIndex>0) neuronCircleDiv.a([
                    DomUtils.createArrow(neuronMiddle.x,neuronMiddle.y,biasVectorTo.x,biasVectorTo.y,{
                        constantwidth:cfg.NEURON_DIAMETER/cfg.BIAS_WIDTH_FACTOR,
                        color:cfg.BIAS_ARROW_BCOL
                    })
                ])

                neuronDiv.a([
                    neuron.div=neuronCircleDiv
                ])

                this.neurondiv.a([
                    neuronDiv
                ])                
            }
        }
    }

    buildCons(cfg:any){                
        this.iterateCons((fromLayerIndex,fromLayer,fromNeuronIndex,fromNeuron,
        toLayerIndex,toLayer,toNeuronIndex,toNeuron)=>{
            let w=this.getWeight(fromLayerIndex,fromNeuronIndex,toLayerIndex,toNeuronIndex)
            
            if(w!=undefined)
            {
                let ce=this.nmCoordsEmit(fromLayerIndex,fromNeuronIndex)                
                let cr=this.nmCoordsReceive(toLayerIndex,toNeuronIndex)

                let col=Misc.signedRgb(w.w*cfg.WEIGHT_COLOR_FACTOR)

                let lw=Misc.normLinAbs(cfg.WEIGHT_ARROW_WIDTH*w.w,cfg.WEIGHT_ARROW_NORM)+1
                
                this.neurondiv.a([
                    DomUtils.createArrow(ce.x,ce.y,cr.x,cr.y,{
                        "constantwidth":lw,
                        "color":col
                    })
                ])
            }
        })
    }

    copyWeights(){
        for(let index=0;index<this.weights.length;index++){            
            let nwm=this.weights[index].data||this.weights[index]._data
            for(let fromNeuronIndex=0;fromNeuronIndex<this.config.layers[index].n;fromNeuronIndex++){                
                for(let toNeuronIndex=0;toNeuronIndex<this.config.layers[index+1].n;toNeuronIndex++){
                    let nw=nwm[toNeuronIndex][fromNeuronIndex]
                    let w=new Weight(nw)
                    this.setWeight(index,fromNeuronIndex,index+1,toNeuronIndex,w)
                }
            }
        }
    }

    copyBiases(){        
        for(let index=0;index<this.biases.length;index++){
            let nbs=this.biases[index].data||this.biases[index]._data
            for(let neuronIndex=0;neuronIndex<nbs.length;neuronIndex++){
                this.layers[index+1].neurons[neuronIndex].bias=nbs[neuronIndex][0]
            }
        }
    }

    copyParameters(){
        this.copyWeights()
        this.copyBiases()
    }

    build(){
        let cfg=Globals.cfg.NeuralNet
        this.cfg=cfg

        this.copyParameters()

        this.buildDivs(cfg)
        this.buildNeurons(cfg)
        if(this.config.showWeights) this.buildCons(cfg)        
        return this
    }

    num_layers(){return this.sizes.length}

    init(){
        this.sizes=this.config.layers.map(layer=>layer.n)

        this.biases=this.sizes.slice(1).map(size=>Misc.randn_matrix(size,1))

        this.weights=[]
        for(let layerIndex=1;layerIndex<this.num_layers();layerIndex++){
            let rm=Misc.randn_matrix(this.sizes[layerIndex],this.sizes[layerIndex-1])            
            this.weights.push(rm)
        }
    }

    initClicked(e:Event){
        this.init()
        this.build()
    }

    backPropRand(verbose:boolean=false){
        let x=this.randomInput()
        let y=this.logicOutput(x)        
        this.backprop(x,y,verbose)
    }

    error_squared:any=null
    epochIndex:number=0
    backPropBatch(n:number){
        this.error_squared=null
        for(let i=0;i<n-1;i++){            
            this.backPropRand()
        }
        this.backPropRand(true)
    }

    backPropClicked(n:number,e:Event){        
        this.backPropBatch(n)
        this.build()
    }

    setI:number=0
    train(n:number){
        if(n>0){
            let loaderI=this.trainloader.currentI
            if(loaderI>0){
                this.setI=Math.floor(Math.random()*loaderI)
                Globals.neural=this.trainloader.neurals[this.setI]
            }
            this.backPropBatch(1000)
            this.epochIndex=n
            this.build()
            n--
            setTimeout(this.train.bind(this,n),100)
        }
    }

    trainClicked(n:number,e:Event){
        this.train(n)
    }

    validationInfo:any={}

    orderResults():number[][]{
        let y=this.activations[this.activations.length-1]._data.slice()
        for(let i=0;i<y.length;i++) y[i]=[i,y[i]]
        y.sort((a,b)=>b[1]-a[1])
        return y        
    }

    validate(vd){
        let x=vd[0].map(a=>[a])
        this.feedforward(x)  
        let y=this.orderResults()      
        let correct_digit=vd[1]
        let actual_digit=y[0][0]
        this.validationInfo.n++
        let ok=(actual_digit==correct_digit)
        if(ok) this.validationInfo.ok++
        this.validationInfo.perf=`${(this.validationInfo.ok/this.validationInfo.n*100).toLocaleString()} %`
        this.validationInfo.c=correct_digit
        this.validationInfo.y=y.map(item=>[item[0],Math.floor(item[1]*10)])
    }

    validateBatch(vds){
        for(let i=0;i<vds.length-1;i++){
            this.validate(vds[i])
        }
        this.validate(vds[Math.floor(Math.random()*vds.length)])
    }

    validateClicked(max:number,e:Event){
        this.validationInfo.n=0
        this.validationInfo.ok=0
        for(let i=0;i<Math.min(max,this.validationloader.currentI);i++){
            this.validateBatch(this.validationloader.neurals[i])
        }        
        this.build()
    }

    ////////////////////////////
    // network   

    feedforward(x){
        let activation=x
        
        this.activations=[x]        

        for(let index=0;index<this.biases.length;index++){
            let b=this.biases[index]
            let w=this.weights[index]
            let z=<any>math.multiply(w,activation)
            z=math.add(z,b)                                    
            activation=math.map(z,Misc.sigmoid)
            this.activations.push(activation)
        }
    }

    randomIndex:number=0
    logicout=[]

    randomInput(){
        let set=Globals.neural
        let index=Math.floor(Math.random()*set.length)
        this.randomIndex=index
        return set[index][0].map(x=>[x])
    }

    logicOutput(x){
        let set=Globals.neural
        let out=set[this.randomIndex][1]
        this.logicout=out
        return out.map(x=>[x])
    }

    cost_derivative(output_activations,y){        
        return math.subtract(output_activations,y)
    }

    backprop(x,y,verbose:boolean=false){
        if(verbose){
            console.log("------------------------")
            console.log("input",JSON.stringify(x))
            console.log("expected output",JSON.stringify(y))
        }

        let nabla_b=[]
        let nabla_w=[]        

        // forward
        for(let index=1;index<this.config.layers.length;index++){
            let l=this.config.layers[index].n
            let lPrev=this.config.layers[index-1].n
            nabla_b.push(math.matrix().resize([l,1]))
            nabla_w.push(math.matrix().resize([lPrev,l]))
        }

        let activation=x

        this.activations=[x]
        this.zs=[]

        for(let index=0;index<this.biases.length;index++){
            let b=this.biases[index]
            let w=this.weights[index]
            let z=<any>math.multiply(w,activation)
            z=math.add(z,b)                        
            this.zs.push(z)
            activation=math.map(z,Misc.sigmoid)
            this.activations.push(activation)
        }

        let act_out=this.activations[this.activations.length-1]            
        let error=<any>math.subtract(act_out,y)            
        let error_T=math.transpose(error)
        let error_squared=math.multiply(error_T,error)            
        if(this.error_squared==null) this.error_squared=error_squared
        else this.error_squared=math.add(this.error_squared,error_squared)

        if(verbose){
            console.log("actual output",JSON.stringify(act_out._data))
            console.log("error",JSON.stringify(error._data))            
        }

        // backward
        let last_activation=this.activations[this.activations.length-1]
        let last_z=this.zs[this.zs.length-1]
        let last_z_sprime=math.map(last_z,Misc.sigmoid_prime)
        let cost_d=this.cost_derivative(last_activation,y)        
        let delta=<any>math.dotMultiply(cost_d,last_z_sprime)        

        nabla_b[nabla_b.length-1]=delta

        let second_last_activation=this.activations[this.activations.length-2]
        let second_last_activation_T=math.transpose(second_last_activation)

        nabla_w[nabla_w.length-1]=math.multiply(delta,second_last_activation_T)        

        for(let l=2;l<this.num_layers();l++){
            let z=this.zs[this.zs.length-l]
            let sp=math.map(z,Misc.sigmoid_prime)
            let weight_l=this.weights[this.weights.length-l+1]
            let weight_l_T=math.transpose(weight_l)
            let weight_l_times_delta=math.multiply(weight_l_T,delta)
            delta=math.dotMultiply(weight_l_times_delta,sp)
            nabla_b[nabla_b.length-l]=delta
            let activations_l=this.activations[this.activations.length-1-l]
            let activations_l_T=math.transpose(activations_l)
            nabla_w[nabla_w.length-l]=math.multiply(delta,activations_l_T)
        }

        // update
        let eta=this.config.eta // learning rate
        let lambda=this.config.lambda // regularization
        for(let index=0;index<this.weights.length;index++){
            let nabla_w_eta=math.multiply(nabla_w[index],eta)            
            let weight_reg=math.multiply(this.weights[index],(1-lambda))
            this.weights[index]=math.subtract(weight_reg,nabla_w_eta)
            let nabla_b_eta=math.multiply(nabla_b[index],eta)
            this.biases[index]=math.subtract(this.biases[index],nabla_b_eta)
        }
    }

    ////////////////////////////
    
}