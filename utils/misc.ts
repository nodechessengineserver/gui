namespace Misc{

    export class Logitem{
        content:string
        isinfo:boolean=false
        isok:boolean=false
        iserror:boolean=false        
        constructor(content:string){
            this.content=content
        }        
        info():Logitem{
            this.isinfo=true
            return this
        }
        ok():Logitem{
            this.isok=true
            return this
        }
        error():Logitem{
            this.iserror=true
            return this
        }
    }
    
    export class Logger{
        MAX_ITEMS=50
        items:Logitem[]=[]
        log(li:Logitem){
            this.items.push(li)
            if(this.items.length>this.MAX_ITEMS){
                this.items=this.items.slice(1)
            }
        }
        reportText():string{
            return this.items.slice().reverse().map(x=>x.content).join("\n")
        }
        reportHtml():string{
            return this.items.slice().reverse().map(x=>{
                let content=x.content.replace(new RegExp("\\n","g"),"<br>")
                if(x.isinfo) content=`<font color="blue">${content}</font>`
                if(x.isok) content=`<font color="green">${content}</font>`
                if(x.iserror) content=`<font color="red">${content}</font>`
                return content
            }).join("<br>")
        }
    }

    export interface SortFunc{
        (a:any,b:any):number
    }

    export interface EventHandler{
        (e:Event):void
    }

    export interface Callback{
        ():void
    }

    export let defaultSortFunc:SortFunc=((a,b)=>{
        if((a==undefined)&&(b==undefined)) return 0
        if((a!=undefined)&&(b==undefined)) return 1
        if((a==undefined)&&(b!=undefined)) return -1

        if((typeof a=="number")&&(typeof b=="number")) return a-b

        a=""+a
        b=""+b

        return (<string>a).localeCompare(b)
    })

    export function isUndefined(x:any){
        return ((x==undefined)||(x==null)||(x=="null"))
    }

    export function grayScaleToRgb(grayscale:number):string{
        let g=Math.floor(grayscale*255)
        return `rgb(${g},${g},${g})`
    }

    export function normLin(x:number,range:number){
        if(x<0) if(x<(-range)) return -range
        if(x>0) if(x>range) return range
        return x
    }

    export function normLinAbs(x:number,range:number){
        return Math.abs(normLin(x,range))
    }

    export function signedRgb(x:number):string{
        let mag=Math.floor(100+Misc.normLinAbs(x,155))
        if(x<=0) return `rgb(${mag},0,0)`
        return `rgb(0,${mag},0)`
    }

    export function circleSvg(d:number,fill:string="#0f0",stroke:string="#00f"):string{
        return `<svg width="${d}" height="${d}">
        <circle cx="${d/2}" cy="${d/2}" r="${d/2}" fill="${fill}" stroke="${stroke}">
        </svg>`
    }

    export function randLabel():number{
        return Math.random()>=0.5?1:-1
    }

    // https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve

    export function randn() {
        var u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    }

    export function randn_array(size:number):number[]{
        let array=[]
        for(let i=0;i<size;i++) array.push(randn())
        return array
    }

    export function randn_matrix(rows:number,cols:number):any{
        let matrix=[]
        for(let i=0;i<rows;i++) matrix.push(randn_array(cols))        
        return math.matrix(matrix)
    }

    export let sigmoid = x => 1 / ( 1 + Math.exp(-x) )

    export let sigmoid_prime = x => sigmoid(x) * ( 1 - sigmoid(x) )

    export function getMathIJ(m:any,i:number,j:number,def:number=0):number{        
        if(m==undefined) return def
        let row=m[i]
        if(row==undefined) return def
        let col=row._data!=undefined?row._data:row
        if(col[j]==undefined) return def
        return col[j]
    }

    export function getData(m:any){
        if(m._data!=undefined) return m._data
        return m
    }

}