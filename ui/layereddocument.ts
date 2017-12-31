class LayeredDocument extends e implements CustomElement<LayeredDocument>{    
    MAX_LAYERS=10
    root:e
    layersRoot:e
    layers:e[]=[]

    constructor(id:string){
        super("div",id)
    }

    build():LayeredDocument{
        this.h().pr().
            a([
                this.root=new e("div").pr(),
                this.layersRoot=new e("div").pa().o()
            ])
        for(let i=0;i<this.MAX_LAYERS;i++){
            this.layers.push(new e("div").pa().o())
        }
        this.layersRoot.a(this.layers)
        return this
    }

    openLayer(i:number):e{
        let layer=this.layers[i]
        let w=window.innerWidth
        let h=window.innerHeight
        let layershadowdiv=new e("div").pa().o().z(w,h).
            s("bc","#aaa").n("op",0.5)
        let layerdiv=new e("div").pa()        
        layer.h().a([
            layershadowdiv,
            layerdiv
        ])
        return layerdiv
    }

    closeLayer(i:number){
        this.layers[i].h().px("w",0).px("h",0)
    }
}

