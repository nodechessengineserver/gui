namespace Globals{
    export let ld=new LayeredDocument("maindoc").build()

    export let guiconfigAsset:TextAsset
    export let neuralAsset:TextAsset

    export let cfg:any
    export let neural:any

    export let app:App
}

let FILE_SEPARATOR="/"

class FileChooserState extends JsonSerializable{
    drive:string="C:"
    dirpathl:string[]=[]
    name:string="default"

    dirpath():string{return this.dirpathl.join(FILE_SEPARATOR)}
    fullpath():string{return [this.drive,...this.dirpathl].join(FILE_SEPARATOR)}
    abspath(name:string=this.name):string{return [this.fullpath(),name].join(FILE_SEPARATOR)}

    constructor(id:string){
        super(id)
    }

    fromJson(json:any){
        this.drive=json.drive
        this.dirpathl=json.dirpathl
        this.name=json.name
    }    
}