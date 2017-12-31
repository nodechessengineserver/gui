namespace Config{
    export let domAbbrev:{[id:string]:string}={
        "w":"width",
        "h":"height",
        "t":"top",
        "l":"left",
        "ta":"textarea",
        "ovf":"overflow",
        "scr":"scroll",
        "ds":"dragstart",
        "md":"mousedown",
        "mm":"mousemove",
        "mo":"mouseout",
        "mu":"mouseup",
        "cur":"cursor",
        "ptr":"pointer",
        "mv":"move",
        "pd":"padding",
        "pdt":"padding-top",
        "pdl":"padding-left",
        "pdb":"padding-bottom",
        "pdr":"padding-right",
        "mg":"margin",
        "mgt":"margin-top",
        "mgl":"margin-left",
        "mgb":"margin-bottom",
        "mgr":"margin-right",
        "fs":"font-size",
        "bc":"background-color",
        "bg":"background",
        "bs":"border-spacing",
        "bcs":"border-collapse",        
        "dr":"draggable",
        "op":"opacity",
        "v":"value",
        "lb":"label",
        "ff":"font-family",
        "ms":"monospace",
        "pos":"position",
        "abs":"absolute",
        "rel":"relative",
        "cs":"colspan"
    }

    export function getAbbrev(p:string):string{
        if(abbrev[p]!=undefined) return abbrev[p]
        return p
    }
}