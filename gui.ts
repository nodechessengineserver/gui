namespace Gui{
    
    function startupError(){

    }

    function startupOk(callback:Misc.Callback){

        Globals.cfg=Globals.guiconfigAsset.asJson()
        Globals.neural=Globals.neuralAsset.asJson()

        callback()

    }

    export function startupThen(callback:Misc.Callback){

        document.getElementById("scriptroot").appendChild(Globals.ld.e)

        Globals.guiconfigAsset=new TextAsset("guiconfig.json")
        Globals.neuralAsset=new TextAsset("assets/neural2/trd/trd.0.json")

        new AssetLoader().
            add(Globals.guiconfigAsset).
            add(Globals.neuralAsset).
            seterrorcallback(startupError).
            setcallback(startupOk.bind(this,callback)).
            load()

    }

}

class App{

    logpane:LogPane

    build():App{

        let nn=new NeuralNet("neuralnet",Globals.ld,5).build()

        //nn.loadClicked(null)
        nn.tabs.selectByIndex(0)
        nn.trainloader=new TrainLoader("trd",50).loadI()
        nn.validationloader=new TrainLoader("ted",10).loadI()

        Globals.ld.root.h().a([
            new TabPane("maintabpane").setWidth(1200).setHeight(600).setTabs([                        
                new Tab("neuralnet","NeuralNet",nn),
                new Tab("fch","FileChooser",new FileChooser("fc",Globals.ld,5).build()),
                new Tab("gitbr","GitBrowser",new GitBrowser().build()),
                new Tab("rocket","Rocket",new RocketCalculator().build()),                
                new Tab("handdigit","HandDigit",new GrayScale().fromData(Globals.neural[0]).build()),
                new Tab("log","Log",this.logpane=new LogPane())
            ]).build()
        ])

        return this

    }

}