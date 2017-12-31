var Config;
(function (Config) {
    Config.domAbbrev = {
        "w": "width",
        "h": "height",
        "t": "top",
        "l": "left",
        "ta": "textarea",
        "ovf": "overflow",
        "scr": "scroll",
        "ds": "dragstart",
        "md": "mousedown",
        "mm": "mousemove",
        "mo": "mouseout",
        "mu": "mouseup",
        "cur": "cursor",
        "ptr": "pointer",
        "mv": "move",
        "pd": "padding",
        "pdt": "padding-top",
        "pdl": "padding-left",
        "pdb": "padding-bottom",
        "pdr": "padding-right",
        "mg": "margin",
        "mgt": "margin-top",
        "mgl": "margin-left",
        "mgb": "margin-bottom",
        "mgr": "margin-right",
        "fs": "font-size",
        "bc": "background-color",
        "bg": "background",
        "bs": "border-spacing",
        "bcs": "border-collapse",
        "dr": "draggable",
        "op": "opacity",
        "v": "value",
        "lb": "label",
        "ff": "font-family",
        "ms": "monospace",
        "pos": "position",
        "abs": "absolute",
        "rel": "relative",
        "cs": "colspan"
    };
    function getAbbrev(p) {
        if (abbrev[p] != undefined)
            return abbrev[p];
        return p;
    }
    Config.getAbbrev = getAbbrev;
})(Config || (Config = {}));
var Misc;
(function (Misc) {
    class Logitem {
        constructor(content) {
            this.isinfo = false;
            this.isok = false;
            this.iserror = false;
            this.content = content;
        }
        info() {
            this.isinfo = true;
            return this;
        }
        ok() {
            this.isok = true;
            return this;
        }
        error() {
            this.iserror = true;
            return this;
        }
    }
    Misc.Logitem = Logitem;
    class Logger {
        constructor() {
            this.MAX_ITEMS = 50;
            this.items = [];
        }
        log(li) {
            this.items.push(li);
            if (this.items.length > this.MAX_ITEMS) {
                this.items = this.items.slice(1);
            }
        }
        reportText() {
            return this.items.slice().reverse().map(x => x.content).join("\n");
        }
        reportHtml() {
            return this.items.slice().reverse().map(x => {
                let content = x.content.replace(new RegExp("\\n", "g"), "<br>");
                if (x.isinfo)
                    content = `<font color="blue">${content}</font>`;
                if (x.isok)
                    content = `<font color="green">${content}</font>`;
                if (x.iserror)
                    content = `<font color="red">${content}</font>`;
                return content;
            }).join("<br>");
        }
    }
    Misc.Logger = Logger;
    Misc.defaultSortFunc = ((a, b) => {
        if ((a == undefined) && (b == undefined))
            return 0;
        if ((a != undefined) && (b == undefined))
            return 1;
        if ((a == undefined) && (b != undefined))
            return -1;
        if ((typeof a == "number") && (typeof b == "number"))
            return a - b;
        a = "" + a;
        b = "" + b;
        return a.localeCompare(b);
    });
    function isUndefined(x) {
        return ((x == undefined) || (x == null) || (x == "null"));
    }
    Misc.isUndefined = isUndefined;
    function grayScaleToRgb(grayscale) {
        let g = Math.floor(grayscale * 255);
        return `rgb(${g},${g},${g})`;
    }
    Misc.grayScaleToRgb = grayScaleToRgb;
    function normLin(x, range) {
        if (x < 0)
            if (x < (-range))
                return -range;
        if (x > 0)
            if (x > range)
                return range;
        return x;
    }
    Misc.normLin = normLin;
    function normLinAbs(x, range) {
        return Math.abs(normLin(x, range));
    }
    Misc.normLinAbs = normLinAbs;
    function signedRgb(x) {
        let mag = Math.floor(100 + Misc.normLinAbs(x, 155));
        if (x <= 0)
            return `rgb(${mag},0,0)`;
        return `rgb(0,${mag},0)`;
    }
    Misc.signedRgb = signedRgb;
    function circleSvg(d, fill = "#0f0", stroke = "#00f") {
        return `<svg width="${d}" height="${d}">
        <circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="${fill}" stroke="${stroke}">
        </svg>`;
    }
    Misc.circleSvg = circleSvg;
    function randLabel() {
        return Math.random() >= 0.5 ? 1 : -1;
    }
    Misc.randLabel = randLabel;
    // https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    function randn() {
        var u = 0, v = 0;
        while (u === 0)
            u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0)
            v = Math.random();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }
    Misc.randn = randn;
    function randn_array(size) {
        let array = [];
        for (let i = 0; i < size; i++)
            array.push(randn());
        return array;
    }
    Misc.randn_array = randn_array;
    function randn_matrix(rows, cols) {
        let matrix = [];
        for (let i = 0; i < rows; i++)
            matrix.push(randn_array(cols));
        return math.matrix(matrix);
    }
    Misc.randn_matrix = randn_matrix;
    Misc.sigmoid = x => 1 / (1 + Math.exp(-x));
    Misc.sigmoid_prime = x => Misc.sigmoid(x) * (1 - Misc.sigmoid(x));
    function getMathIJ(m, i, j, def = 0) {
        if (m == undefined)
            return def;
        let row = m[i];
        if (row == undefined)
            return def;
        let col = row._data != undefined ? row._data : row;
        if (col[j] == undefined)
            return def;
        return col[j];
    }
    Misc.getMathIJ = getMathIJ;
    function getData(m) {
        if (m._data != undefined)
            return m._data;
        return m;
    }
    Misc.getData = getData;
})(Misc || (Misc = {}));
var Vectors;
(function (Vectors) {
    class ScreenVector {
        constructor(_x, _y) { this.x = _x; this.y = _y; }
        Plus(sv) {
            return new ScreenVector(this.x + sv.x, this.y + sv.y);
        }
        Minus(sv) {
            return new ScreenVector(this.x - sv.x, this.y - sv.y);
        }
    }
    Vectors.ScreenVector = ScreenVector;
    class Square {
        constructor(_file, _rank) { this.file = _file; this.rank = _rank; }
        Plus(sq) {
            return new Square(this.file + sq.file, this.rank + sq.rank);
        }
        Minus(sq) {
            return new Square(this.file - sq.file, this.rank - sq.rank);
        }
    }
    Vectors.Square = Square;
    class Piece {
        constructor() {
            this.kind = "-";
            this.color = 0;
        }
    }
    Vectors.Piece = Piece;
    class Move {
        constructor(_fsq, _tsq, _prompiece = new Piece()) {
            this.prompiece = new Piece();
            this.fsq = _fsq;
            this.tsq = _tsq;
            this.prompiece = _prompiece;
        }
    }
    Vectors.Move = Move;
    class Vect {
        constructor(_x, _y) {
            this.x = _x;
            this.y = _y;
        }
        calctrig(r, multrby = Math.PI) {
            this.sin = Math.sin(r * multrby);
            this.cos = Math.cos(r * multrby);
        }
        r(r) {
            this.calctrig(r);
            return new Vect(this.x * this.cos - this.y * this.sin, this.x * this.sin + this.y * this.cos);
        }
        n(l) {
            let c = (l / this.l());
            return new Vect(this.x * c, this.y * c);
        }
        u() { return this.n(1); }
        p(v) {
            return new Vect(this.x + v.x, this.y + v.y);
        }
        m(v) {
            return new Vect(this.x - v.x, this.y - v.y);
        }
        i() {
            return new Vect(-this.x, -this.y);
        }
        s(s) {
            return new Vect(this.x * s, this.y * s);
        }
        l() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    }
    Vectors.Vect = Vect;
    let INFINITE_COORD = 1E6;
    class Polygon {
        constructor() {
            this.vects = [];
        }
        a(v) {
            this.vects.push(v);
            return this;
        }
        normalize(overwrite = true) {
            let minx = INFINITE_COORD;
            let miny = INFINITE_COORD;
            let maxx = -INFINITE_COORD;
            let maxy = -INFINITE_COORD;
            this.vects.map(v => {
                if (v.x < minx)
                    minx = v.x;
                if (v.y < miny)
                    miny = v.y;
                if (v.x > maxx)
                    maxx = v.x;
                if (v.y > maxy)
                    maxy = v.y;
            });
            let min = new Vect(minx, miny);
            let max = new Vect(maxx, maxy);
            this.shift = min.i();
            this.size = max.m(min);
            if (overwrite) {
                this.vects = this.vects.map(v => v.p(this.shift));
            }
            return this;
        }
        // should only be called on a normalized polygon
        reportSvg(bcol = "#dfdf3f") {
            let points = this.vects.map(v => (v.x + "," + v.y)).join(" ");
            return `
<svg width="${this.size.x}" height="${this.size.y}" style="position:absolute;top:0px;left:0px;">
<polygon points="${points}" style="fill:${bcol};stroke-width:0px;">
</svg>
`;
        }
    }
    Vectors.Polygon = Polygon;
    class Arrow {
        constructor(from, to, params) {
            let widthfactor = params["widthfactor"] || 0.1;
            let handlelength = params["handlelength"] || 0.7;
            let headfactor = params["headfactor"] || 0.2;
            let constantwidth = params["constantwidth"] || 0.0;
            let cw = (constantwidth != 0.0);
            let diff = to.m(from);
            let width = cw ? constantwidth : diff.l() * widthfactor;
            let bottomright = cw ? diff.n(constantwidth / 2.0).r(0.5) : diff.n(width / 2.0).r(0.5);
            let bottomleft = bottomright.i();
            let handle = cw ? diff.n(diff.l() - 3.0 * constantwidth) : diff.n(diff.l() * handlelength);
            let headfromright = bottomright.p(handle);
            let headfromleft = bottomleft.p(handle);
            let headtoright = headfromright.p(cw ? bottomright.s(2.0) : bottomright.n(diff.l() * headfactor));
            let headtoleft = headfromleft.p(cw ? bottomleft.s(2.0) : bottomleft.n(diff.l() * headfactor));
            let pg = new Polygon().
                a(bottomright).
                a(headfromright).
                a(headtoright).
                a(diff).
                a(headtoleft).
                a(headfromleft).
                a(bottomleft).
                normalize();
            this.svgorig = to.m(pg.vects[3]);
            this.svg = pg.reportSvg(params["color"]);
        }
    }
    Vectors.Arrow = Arrow;
})(Vectors || (Vectors = {}));
var TextEncodingUtils;
(function (TextEncodingUtils) {
    class TEnc {
        constructor(label, options) {
            this.tenc = new TextEncoder(label, options);
        }
        encode(input, options) {
            return this.tenc.encode(input, options);
        }
    }
    TextEncodingUtils.TEnc = TEnc;
    class TDec {
        constructor(label, options) {
            this.tdec = new TextDecoder(label, options);
        }
        decode(input, options) {
            return this.tdec.decode(input, options);
        }
    }
    TextEncodingUtils.TDec = TDec;
    let tdec = new TDec();
    let tenc = new TEnc();
    function encode(input) {
        return tenc.encode(input);
    }
    TextEncodingUtils.encode = encode;
    function decode(input) {
        return tdec.decode(input);
    }
    TextEncodingUtils.decode = decode;
})(TextEncodingUtils || (TextEncodingUtils = {}));
class TextAsset {
    constructor(_url) {
        this.isready = false;
        this.isfailed = false;
        this.url = _url;
    }
    load() {
        try {
            fetch(this.url).then(response => response.arrayBuffer()).then(bytes => this.onload(bytes));
        }
        catch (e) {
            this.isfailed = true;
        }
    }
    onload(bytes) {
        let view = new Uint8Array(bytes);
        this.text = TextEncodingUtils.decode(view);
        this.isready = true;
    }
    ready() {
        return this.isready;
    }
    failed() {
        return this.isfailed;
    }
    asJson() {
        return JSON.parse(this.text);
    }
}
class AjaxAsset {
    constructor(_reqjson) {
        this.url = "http://localhost:9000/ajax";
        this.isready = false;
        this.isfailed = false;
        this.reqjson = _reqjson;
    }
    load() {
        let body = JSON.stringify(this.reqjson);
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        try {
            fetch(this.url, {
                method: 'POST',
                headers: headers,
                body: body
            }).then(response => response.json()).then(data => this.onload(data));
        }
        catch (e) {
            this.isfailed = true;
        }
    }
    onload(data) {
        this.resjson = data;
        this.isready = true;
    }
    ready() {
        return this.isready;
    }
    failed() {
        return this.isfailed;
    }
}
class AssetLoader {
    constructor() {
        this.WAIT = 250;
        this.RETRIES = 40;
        this.items = [];
        this.errorcallback = function () {
            //console.log("loading assets failed");
        };
    }
    add(l) {
        this.items.push(l);
        return this;
    }
    setcallback(_callback) {
        this.callback = _callback;
        return this;
    }
    seterrorcallback(_errorcallback) {
        this.errorcallback = _errorcallback;
        return this;
    }
    load() {
        this.items.map(item => item.load());
        //console.log("loading assets...")
        this.retries = 0;
        setTimeout(this.loadwait.bind(this), this.WAIT);
    }
    loadwait() {
        if (this.items.every(value => value.failed())) {
            this.errorcallback();
            return;
        }
        for (let i in this.items) {
            if (!this.items[i].ready()) {
                this.retries++;
                if (this.retries <= this.RETRIES) {
                    //console.log("waiting for assets to load... try "+this.retries)
                    setTimeout(this.loadwait.bind(this), this.WAIT);
                    return;
                }
                else {
                    this.errorcallback();
                    return;
                }
            }
        }
        //console.log("assets loaded ok")
        if (this.callback != undefined)
            this.callback();
    }
}
class AjaxRequest {
    ajaxok() {
        this.callback(true, this.ajaxasset.resjson);
    }
    ajaxfailed() {
        this.callback(false, {});
    }
    constructor(reqjson, callback) {
        this.ajaxasset = new AjaxAsset(reqjson);
        this.callback = callback;
        new AssetLoader().
            add(this.ajaxasset).
            setcallback(this.ajaxok.bind(this)).
            seterrorcallback(this.ajaxfailed.bind(this)).
            load();
    }
}
var abbrev = Config.domAbbrev;
var getAbbrev = Config.getAbbrev;
var DomUtils;
(function (DomUtils) {
    function limit(x, min, max) {
        if (x < min)
            return min;
        if (x > max)
            return max;
        return x;
    }
    DomUtils.limit = limit;
    function createArrow(fromX, fromY, toX, toY, param) {
        let arrow = new Vectors.Arrow(new Vectors.Vect(fromX, fromY), new Vectors.Vect(toX, toY), param);
        let ad = new e("div").pa().o(arrow.svgorig.x, arrow.svgorig.y).h(arrow.svg);
        return ad;
    }
    DomUtils.createArrow = createArrow;
})(DomUtils || (DomUtils = {}));
var limit = DomUtils.limit;
class JsonSerializable {
    storeId() {
        return this.id;
    }
    constructor(id) {
        this.id = id;
    }
    fromJson(json) { }
    fromJsonText(jsontext) {
        try {
            let json = JSON.parse(jsontext);
            this.fromJson(json);
        }
        catch (e) { }
    }
    toJsonText() {
        return JSON.stringify(this);
    }
    toJson() {
        return JSON.parse(this.toJsonText());
    }
    store() {
        let storeid = this.storeId();
        let jsontext = this.toJsonText();
        localStorage.setItem(storeid, jsontext);
        //console.log("store",storeid,jsontext)
    }
    stored() {
        return localStorage.getItem(this.storeId());
    }
    hasStored() {
        return !Misc.isUndefined(this.stored());
    }
    fromStored() {
        //console.log("fromStored",this.id,this.stored())
        if (!this.hasStored())
            return;
        try {
            this.fromJsonText(this.stored());
        }
        catch (e) { }
    }
    copyFrom(js) {
        this.fromJsonText(js.toJsonText());
    }
}
class e extends JsonSerializable {
    constructor(tag, id = null) {
        super(id);
        this.key = ""; // for sorting content
        tag = getAbbrev(tag);
        this.e = document.createElement(tag);
        if (id != null)
            e.l[id] = this;
    }
    focus() { this.e.focus(); return this; }
    blur() { this.e.blur(); return this; }
    k(key) {
        this.key = key;
        return this;
    }
    pr() { this.s("pos", "rel"); return this; }
    pa() { this.s("pos", "abs"); return this; }
    bu(name) { this.s("bg", `url(assets/images/backgrounds/${name})`); return this; }
    o(l = 0, t = 0) {
        return this.px("l", l).px("t", t);
    }
    z(w = 0, h = 0) {
        return this.px("w", w).px("h", h);
    }
    r(l = 0, t = 0, w = 0, h = 0) {
        return this.o(l, t).z(w, h);
    }
    c() {
        return getComputedStyle(this.e);
    }
    static getPx(v) {
        v = v.replace("px", "");
        return parseFloat(v);
    }
    cpx(p) {
        return e.getPx(this.c()[getAbbrev(p)]);
    }
    a(es) {
        es.map(e => this.e.appendChild(e.e));
        return this;
    }
    s(p, s) {
        p = getAbbrev(p);
        s = getAbbrev(s);
        this.e.style[p] = s;
        return this;
    }
    n(p, n) {
        return this.s(p, "" + n);
    }
    px(p, n) {
        return this.s(p, n + "px");
    }
    ae(kind, handler) {
        kind = getAbbrev(kind);
        this.e.addEventListener(kind, handler);
        return this;
    }
    h(content = "") {
        this.e.innerHTML = content;
        return this;
    }
    t(a, v) {
        a = getAbbrev(a);
        v = getAbbrev(v);
        this.e.setAttribute(a, v);
        return this;
    }
    tn(a, n) {
        a = getAbbrev(a);
        this.e.setAttribute(a, "" + n);
        return this;
    }
    rt(a) {
        a = getAbbrev(a);
        this.e.removeAttribute(a);
        return this;
    }
    bcr() {
        return this.e.getBoundingClientRect();
    }
    bcrt() { return this.bcr().top; }
    bcrl() { return this.bcr().left; }
}
e.l = {};
class Button extends e {
    constructor(caption = "", id = null) {
        super("input", id);
        this.t("type", "button");
        this.t("value", caption);
    }
    onClick(handler) {
        this.ae("md", handler);
        return this;
    }
}
class TextInput extends e {
    constructor(id = null) {
        super("input", id);
        this.t("type", "text");
    }
    setText(content) {
        this.e["value"] = content;
        return this;
    }
    getText() {
        return this.e["value"];
    }
}
class TextArea extends e {
    constructor(id = null) {
        super("textarea", id);
    }
    setText(content) {
        this.e.innerHTML = content;
        return this;
    }
    getText() {
        return this.e["value"];
    }
}
class PasswordInput extends e {
    constructor(id = null) {
        super("input", id);
        this.t("type", "password");
    }
    setText(content) {
        this.e["value"] = content;
        return this;
    }
    getText() {
        return this.e["value"];
    }
}
class ComboOption extends e {
    constructor(key, display) {
        super("option");
        this.key = key;
        this.display = display;
        this.t("value", key).h(this.display);
    }
}
class ComboBox extends e {
    constructor(id = null) {
        super("select", id);
        this.options = [];
        this.selectedIndex = -1;
    }
    clear() {
        this.options = [];
        this.selectedIndex = -1;
        return this;
    }
    addOptions(os) {
        os.map(o => this.options.push(o));
        return this;
    }
    selectByIndex(index) {
        if (this.options.length <= index) {
            this.selectedIndex = -1;
            this.selectedKey = null;
            return this;
        }
        this.selectedIndex = index;
        this.selectedKey = this.options[this.selectedIndex].key;
        for (let i = 0; i < this.options.length; i++) {
            this.options[i].rt("selected");
            if (i == this.selectedIndex) {
                this.options[i].t("selected", "true");
            }
        }
        return this;
    }
    indexByKey(key) {
        for (let i = 0; i < this.options.length; i++) {
            if (this.options[i].key == key)
                return i;
        }
        return -1;
    }
    selectByKey(key) {
        this.selectByIndex(this.indexByKey(key));
    }
    build() {
        this.h("").a(this.options);
        this.ae("change", this.change.bind(this));
        return this;
    }
    change(e) {
        let t = e.target;
        this.selectedKey = t.selectedOptions[0].value;
        this.selectedIndex = this.indexByKey(this.selectedKey);
        if (this.changeHandler != undefined)
            this.changeHandler(e);
    }
    onChange(handler) {
        this.changeHandler = handler;
        return this;
    }
}
class FileView extends e {
    constructor(file, ld, ldi) {
        super("div");
        this.file = file;
        this.ld = ld;
        this.ldi = ldi;
    }
    closeClicked(e) {
        this.ld.closeLayer(this.ldi);
    }
    ajaxok() {
        let resjson = this.ajaxasset.resjson;
        let content = resjson.content;
        this.contentdiv.h(content);
    }
    ajaxfailed() {
    }
    loadFile() {
        this.ajaxasset = new AjaxAsset({
            action: "readtextfile",
            path: this.file.abspath
        });
        new AssetLoader().
            add(this.ajaxasset).
            setcallback(this.ajaxok.bind(this)).
            seterrorcallback(this.ajaxfailed.bind(this)).
            load();
    }
    build() {
        this.h("").pa().r(50, 50, 620, 450).s("bc", "#dfd").a([
            new Button("Close").onClick(this.closeClicked.bind(this)).px("mgt", 5).px("mgl", 10),
            new e("br"),
            this.contentdiv = new e("ta").px("mgl", 10).px("mgt", 5).z(600, 400)
        ]);
        this.layer = this.ld.openLayer(this.ldi);
        this.layer.a([this]);
        this.loadFile();
        return this;
    }
}
class DragDiv extends e {
    constructor() {
        super("div");
        this.LARGETOPBAR_PADDING = 100;
        this.MIN_TOP = 0;
        this.MIN_LEFT = 0;
        this.MAX_TOP = 400;
        this.MAX_LEFT = 1000;
        this.width = 200;
        this.height = 50;
        this.left = 0;
        this.top = 0;
        this.dragunderway = false;
        this.moveDiv = false;
    }
    limitTop(t) { return limit(t, this.MIN_TOP - this.computedTop, this.MAX_TOP - this.computedTop); }
    limitLeft(l) { return limit(l, this.MIN_LEFT - this.computedLeft, this.MAX_LEFT - this.computedLeft); }
    setTop(top) { this.top = top; return this; }
    setLeft(left) { this.left = left; return this; }
    setWidth(width) { this.width = width; return this; }
    setHeight(height) { this.height = height; return this; }
    setLargeTopBar(largetopbar) { this.largetopbar = largetopbar; return this; }
    setMouseMoveCallback(mouseMoveCallback) { this.mouseMoveCallback = mouseMoveCallback; return this; }
    setMouseUpCallback(mouseUpCallback) { this.mouseUpCallback = mouseUpCallback; return this; }
    setMoveDiv(moveDiv) { this.moveDiv = moveDiv; return this; }
    limitedDragd() {
        return this.dragd;
    }
    windowdragstart(e) {
        e.preventDefault();
        let me = e;
        this.dragstart = new Vectors.ScreenVector(me.clientX, me.clientY);
        this.dragunderway = true;
        this.largetopbar.z(2 * this.LARGETOPBAR_PADDING + this.width, 2 * this.LARGETOPBAR_PADDING + this.height);
        this.computedTop = this.bcrt();
        this.computedLeft = this.bcrl();
    }
    windowmouseout(e) {
        this.windowmousemove(e);
        this.windowmouseup(null);
        this.dragunderway = false;
    }
    windowmousemove(e) {
        let me = e;
        if (this.dragunderway) {
            this.dragd = new Vectors.ScreenVector(me.clientX, me.clientY).Minus(this.dragstart);
            let ldd = this.limitedDragd();
            if (this.mouseMoveCallback != undefined) {
                this.mouseMoveCallback(ldd);
            }
            if (this.moveDiv) {
                this.o(this.left + ldd.x, this.top + ldd.y);
            }
        }
    }
    windowmouseup(e) {
        if (this.dragunderway) {
            this.dragunderway = false;
            this.largetopbar.z();
            let ldd = this.limitedDragd();
            if (this.mouseUpCallback != undefined) {
                this.mouseUpCallback(ldd);
            }
            if (this.moveDiv) {
                this.top = this.top + ldd.y;
                this.left = this.left + ldd.x;
                this.o(this.left, this.top);
            }
        }
    }
    build() {
        this.r(this.left, this.top, this.width, this.height).
            t("dr", "true").pa().s("cur", "mv").
            ae("dragstart", this.windowdragstart.bind(this));
        this.largetopbar.pa().s("bc", "#00f").n("op", 0.0).
            o(-this.LARGETOPBAR_PADDING, -this.LARGETOPBAR_PADDING).z().
            ae("mm", this.windowmousemove.bind(this)).
            ae("mo", this.windowmouseout.bind(this)).
            ae("mu", this.windowmouseup.bind(this));
        return this;
    }
}
class RadioButton {
    constructor(key, caption, bcol = "#efefef") {
        this.key = key;
        this.caption = caption;
        this.bcol = bcol;
    }
}
class RadioButtons extends e {
    constructor() {
        super("table");
        this.selectedIndex = -1;
        this.px("bs", 2).s("bcs", "separate");
    }
    setButtons(buttons) {
        this.buttons = buttons;
        for (let i = 0; i < this.buttons.length; i++)
            this.buttons[i].index = i;
        return this;
    }
    showSelected() {
        for (let i = 0; i < this.buttons.length; i++) {
            let b = this.buttons[i];
            let bcol = i == this.selectedIndex ? b.bcol : "initial";
            b.button.s("bc", bcol);
        }
    }
    setSelectedIndex(index) {
        this.selectedIndex = index;
        this.showSelected();
        return this;
    }
    buttonClicked(b, e) {
        this.setSelectedIndex(b.index);
    }
    build() {
        this.h("").a([
            new e("tr").a(this.buttons.map(b => new e("td").a([b.button = new Button(b.caption).
                    onClick(this.buttonClicked.bind(this, b))])))
        ]);
        this.showSelected();
        return this;
    }
}
class EditableList extends e {
    constructor() {
        super("table");
        this.indexDecorator = (i) => `${i}.`;
    }
    setTitle(title) {
        if (typeof title == "string") {
            this.title = new e("label").h(title);
        }
        else
            this.title = title;
        return this;
    }
    setList(list) {
        this.list = list;
        return this;
    }
    setFactory(factory) {
        this.factory = factory;
        return this;
    }
    setIndexDecorator(indexDecorator) {
        this.indexDecorator = indexDecorator;
        return this;
    }
    setApplyCallback(callback) {
        this.applyCallback = callback;
        return this;
    }
    applyClicked(e) {
        if (this.applyCallback != undefined)
            this.applyCallback();
    }
    deleteClicked(i, e) {
        this.list.splice(i, 1);
        this.build();
    }
    addClicked() {
        if (this.factory != undefined) {
            this.list.push(this.factory());
            this.build();
        }
    }
    build() {
        this.px("bs", 2).s("bcs", "separate").px("pd", 5).s("bc", "#ab9").h("");
        this.a([
            new e("tr").a([
                new e("td"),
                new e("td").t("align", "center").a([
                    this.title
                ]).tn("cs", 2)
            ]),
            new e("tr").a([
                new e("td"),
                new e("td").tn("cs", 2).s("bc", "#ddf").px("pd", 3).a([
                    new e("div").px("pd", 3).s("bc", "#7f7").s("float", "left").a([
                        new Button("Apply").
                            onClick(this.applyClicked.bind(this)).
                            px("w", 100)
                    ]),
                    new e("div").px("mgt", 1).px("pd", 2).s("bc", "#aaf").s("float", "right").a([
                        new Button("+ Add new").
                            onClick(this.addClicked.bind(this))
                    ])
                ])
            ])
        ]);
        let i = 0;
        this.a(this.list.map(item => {
            return new e("tr").a([
                new e("td").h(this.indexDecorator(i + 1)).px("pdr", 5),
                new e("td").a([item]),
                new e("td").a([
                    new e("div").px("pd", 3).s("bc", "#d77").a([
                        new Button("Delete").
                            onClick(this.deleteClicked.bind(this, i++))
                    ])
                ])
            ]);
        }));
        return this;
    }
}
class SortableGridKey extends e {
    constructor(key, parent, sortfunc = Misc.defaultSortFunc) {
        super("table", parent.id + "_" + key);
        this.index = 0;
        this.direction = 1;
        this.key = key;
        this.parent = parent;
        this.sortfunc = sortfunc;
        this.fromStored();
    }
    toJson() {
        return {
            index: this.index,
            direction: this.direction
        };
    }
    fromJson(json) {
        this.index = json.index || 0;
        this.direction = json.direction || 1;
    }
    toJsonText() {
        return JSON.stringify(this.toJson());
    }
    sortPressed(direction, e) {
        this.direction = direction;
        this.build();
        this.store();
        this.parent.build();
    }
    build() {
        let tr = new e("tr");
        if (this.index > 0)
            tr.a([new e("td").a([new Button("<").onClick(this.parent.moveColumn.bind(this.parent, this, -1))])]);
        if (this.index < (this.parent.keys.length - 1))
            tr.a([new e("td").a([new Button(">").onClick(this.parent.moveColumn.bind(this.parent, this, 1))])]);
        this.px("bs", 1).s("bcs", "separate").h("").a([tr.a([
                new e("td").h(this.key),
                new e("td").a([
                    new Button("a").onClick(this.sortPressed.bind(this, 1)).
                        s("bc", this.direction == 1 ? SortableGridKey.SEL_BCOL : SortableGridKey.UNSEL_BCOL)
                ]),
                new e("td").a([
                    new Button("d").onClick(this.sortPressed.bind(this, -1)).
                        s("bc", this.direction == -1 ? SortableGridKey.SEL_BCOL : SortableGridKey.UNSEL_BCOL)
                ])
            ])]);
        this.store();
        return this;
    }
}
SortableGridKey.SEL_BCOL = "#0f0";
SortableGridKey.UNSEL_BCOL = "#eee";
class SortableGridIndex {
    constructor(row, key) {
        this.row = row;
        this.key = key;
    }
    hash() { return `${this.row},${this.key}`; }
}
class SortableGrid extends e {
    constructor(id) {
        super("table", id);
        this.keys = [];
        this.items = {};
        this.maxrow = 0;
        this.numFixed = 0;
    }
    clearItems() { this.items = {}; }
    setItem(sgi, e) {
        this.items[sgi.hash()] = e;
        if (sgi.row > this.maxrow)
            this.maxrow = sgi.row;
    }
    getItem(sgi) { return this.items[sgi.hash()]; }
    moveColumn(key, direction) {
        let index = this.keys.indexOf(key);
        if (index < 0)
            return; // invalid key
        let before = this.keys.slice(0, index);
        let beforelast = before.pop();
        let after = this.keys.slice(index + 1);
        let afterfirst = after.shift();
        let result = this.keys;
        if ((direction == -1) && (beforelast != undefined)) {
            result = [...before, key, beforelast, afterfirst, ...after];
        }
        if ((direction == 1) && (afterfirst != undefined)) {
            result = [...before, beforelast, afterfirst, key, ...after];
        }
        result = result.filter(key => key != undefined);
        this.keys = result;
        this.build();
    }
    sort() {
        let indices = [];
        for (let row = this.numFixed; row <= this.maxrow; row++) {
            indices.push(row);
        }
        indices.sort((ia, ib) => {
            for (let key of this.keys) {
                let a = this.getItem(new SortableGridIndex(ia, key.key)).key;
                let b = this.getItem(new SortableGridIndex(ib, key.key)).key;
                let cmp = key.sortfunc(a, b);
                if (cmp != 0) {
                    let ecmp = cmp * key.direction;
                    return ecmp;
                }
            }
            return 0;
        });
        for (let i = this.numFixed - 1; i >= 0; i--)
            indices.unshift(i);
        let newitems = {};
        for (let row = 0; row <= this.maxrow; row++) {
            for (let key of this.keys) {
                newitems[new SortableGridIndex(row, key.key).hash()] =
                    this.items[new SortableGridIndex(indices[row], key.key).hash()];
            }
        }
        this.items = newitems;
    }
    setKeys(keys) {
        this.keys = keys;
        this.sortKeys();
        return this;
    }
    setNumFixed(numFixed) { this.numFixed = numFixed; return this; }
    sortKeys() {
        this.keys.sort((a, b) => (a.index - b.index));
    }
    markRow(row, kind = "mark") {
        if (row < 0)
            return;
        switch (kind) {
            case "mark":
                this.tablerows[row].s("bc", "0f0");
                break;
            case "unmark":
                this.tablerows[row].s("bc", "initial");
                break;
        }
    }
    unMarkAllRows() {
        for (let row = 0; row <= this.maxrow; row++) {
            this.markRow(row, "unmark");
        }
    }
    getRowByColValue(key, value) {
        for (let row = 0; row <= this.maxrow; row++) {
            let item = this.getItem(new SortableGridIndex(row, key));
            if (item.key == value)
                return row;
        }
        return -1;
    }
    build() {
        this.sort();
        this.px("bs", 5).s("bcs", "separate").h("").a([new e("tr").a(this.keys.map(key => new e("td").a([key.build()])))]);
        this.tablerows = [];
        for (let row = 0; row <= this.maxrow; row++) {
            this.a([this.tablerows[row] = new e("tr").a(this.keys.map(key => {
                    let item = this.getItem(new SortableGridIndex(row, key.key));
                    let x = item == undefined ? new e("div").h("") : item;
                    return new e("td").a([x]);
                }))]);
        }
        for (let index = 0; index < this.keys.length; index++) {
            this.keys[index].index = index;
            this.keys[index].build();
        }
        return this;
    }
}
class LayeredDocument extends e {
    constructor(id) {
        super("div", id);
        this.MAX_LAYERS = 10;
        this.layers = [];
    }
    build() {
        this.h().pr().
            a([
            this.root = new e("div").pr(),
            this.layersRoot = new e("div").pa().o()
        ]);
        for (let i = 0; i < this.MAX_LAYERS; i++) {
            this.layers.push(new e("div").pa().o());
        }
        this.layersRoot.a(this.layers);
        return this;
    }
    openLayer(i) {
        let layer = this.layers[i];
        let w = window.innerWidth;
        let h = window.innerHeight;
        let layershadowdiv = new e("div").pa().o().z(w, h).
            s("bc", "#aaa").n("op", 0.5);
        let layerdiv = new e("div").pa();
        layer.h().a([
            layershadowdiv,
            layerdiv
        ]);
        return layerdiv;
    }
    closeLayer(i) {
        this.layers[i].h().px("w", 0).px("h", 0);
    }
}
var Globals;
(function (Globals) {
    Globals.ld = new LayeredDocument("maindoc").build();
})(Globals || (Globals = {}));
let FILE_SEPARATOR = "/";
class FileChooserState extends JsonSerializable {
    constructor(id) {
        super(id);
        this.drive = "C:";
        this.dirpathl = [];
        this.name = "default";
    }
    dirpath() { return this.dirpathl.join(FILE_SEPARATOR); }
    fullpath() { return [this.drive, ...this.dirpathl].join(FILE_SEPARATOR); }
    abspath(name = this.name) { return [this.fullpath(), name].join(FILE_SEPARATOR); }
    fromJson(json) {
        this.drive = json.drive;
        this.dirpathl = json.dirpathl;
        this.name = json.name;
    }
}
class DraggableWindow extends e {
    constructor(id, ld, ldi) {
        super("div", id);
        this.BAR_WIDTH = Globals.cfg.DraggableWindow.BAR_WIDTH;
        this.BOTTOM_BAR_WIDTH = Globals.cfg.DraggableWindow.BOTTOM_BAR_WIDTH;
        this.PADDING = Globals.cfg.DraggableWindow.PADDING;
        this.DEFAULT_WIDTH = Globals.cfg.DraggableWindow.DEFAULT_WIDTH;
        this.DEFAULT_HEIGHT = Globals.cfg.DraggableWindow.DEFAULT_HEIGHT;
        this.top = 0;
        this.left = 0;
        this.widgetHeight = 0;
        this.title = "";
        this.buttons = [
            ["Cancel", this.cancel]
        ];
        this.DRAG_SIZE_DIV_WIDTH = Globals.cfg.DraggableWindow.DRAG_SIZE_DIV_WIDTH;
        this.ld = ld;
        this.ldi = ldi;
        this.setDefaultSize();
        this.fromStored();
        ld.openLayer(ldi).a([this]);
    }
    setDefaultSize() {
        this.width = this.DEFAULT_WIDTH;
        this.height = this.DEFAULT_HEIGHT;
    }
    setWidgetHeight(widgetHeight) {
        this.widgetHeight = widgetHeight;
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setWidth(width) { this.width = width; return this; }
    setHeight(height) { this.height = height; return this; }
    adjustMiddle() {
        this.left = (window.innerWidth - this.totalWidth()) / 2;
        this.top = (window.innerHeight - this.totalHeight()) / 2;
    }
    dragMouseMoveCallback(dragd) {
        this.o(this.left + dragd.x, this.top + dragd.y);
    }
    dragMouseUpCallback(dragd) {
        this.left = this.left + dragd.x;
        this.top = this.top + dragd.y;
        this.o(this.left, this.top);
        this.store();
    }
    dragSizeMouseMoveCallback(dragd) {
    }
    dragSizeMouseUpCallback(dragd) {
        this.width += dragd.x;
        this.height += dragd.y;
        this.store();
        this.build();
    }
    build() {
        let cfg = Globals.cfg.DraggableWindow;
        if (!this.hasStored()) {
            this.adjustMiddle();
        }
        this.pa().z(this.totalWidth(), this.totalHeight()).bu("wood.jpg");
        this.h().o(this.left, this.top).a([
            //////////////////////////////////////////////
            this.topbardiv = new DragDiv().
                setLeft(this.PADDING).setTop(this.PADDING).
                setWidth(this.width).setHeight(this.height).
                setMouseMoveCallback(this.dragMouseMoveCallback.bind(this)).
                setMouseUpCallback(this.dragMouseUpCallback.bind(this)).
                s("bc", cfg.TOPBARDIV_BCOL).a([
                //////////////////////////////////////////////
                new e("div").h(this.title).pa().o(this.PADDING, this.PADDING).
                    px("fs", this.BAR_WIDTH - 2 * this.PADDING),
                //////////////////////////////////////////////
                this.largetopbar = new e("div")
                //////////////////////////////////////////////
            ]),
            //////////////////////////////////////////////
            new e("div").pa().s("bc", cfg.WIDGET_BCOL).
                r(this.PADDING, this.BAR_WIDTH + 2 * this.PADDING, this.width, this.height).a([
                this.widgetdiv = new e("div").pa().
                    r(0, 0, this.width, this.widgetHeight).s("bc", cfg.WIDGETDIV_BCOL),
                this.contentdiv = new e("div").s("ovf", "scroll").pa().
                    r(0, this.widgetHeight, this.width, this.height - this.widgetHeight)
            ]),
            //////////////////////////////////////////////
            this.bottombardiv = new e("div").pa().s("bc", cfg.BOTTOMBARDIV_BCOL).
                r(this.PADDING, this.BAR_WIDTH + this.height + 3 * this.PADDING, this.width, this.BOTTOM_BAR_WIDTH).a(
            //////////////////////////////////////////////
            this.buttons.map(bd => new Button(bd[0]).onClick(bd[1].bind(this)).
                px("mgl", this.PADDING).px("mgt", this.PADDING).
                px("h", this.BOTTOM_BAR_WIDTH - 2 * this.PADDING))
            //////////////////////////////////////////////                    
            )
            //////////////////////////////////////////////
        ]);
        this.bottombardiv.a([
            this.dragSizeDiv = new DragDiv().
                setLeft(this.width - this.DRAG_SIZE_DIV_WIDTH - this.PADDING).setTop(this.PADDING).
                setWidth(this.DRAG_SIZE_DIV_WIDTH).setHeight(this.BOTTOM_BAR_WIDTH - 2 * this.PADDING).
                setMouseMoveCallback(this.dragSizeMouseMoveCallback.bind(this)).
                setMouseUpCallback(this.dragSizeMouseUpCallback.bind(this)).
                setMoveDiv(true).
                s("bc", cfg.DRAGSIZEDIV_BCOL).a([
                //////////////////////////////////////////////
                this.dragSizeLargeTopBar = new e("div")
                //////////////////////////////////////////////
            ])
        ]);
        this.topbardiv.setLargeTopBar(this.largetopbar).build();
        this.dragSizeDiv.setLargeTopBar(this.dragSizeLargeTopBar).build();
        return this;
    }
    cancel() {
        this.ld.closeLayer(this.ldi);
    }
    totalHeight() { return this.BAR_WIDTH + this.height + this.BOTTOM_BAR_WIDTH + 4 * this.PADDING; }
    totalWidth() { return this.width + 2 * this.PADDING; }
    toJsonText() {
        return JSON.stringify(this, ["top", "left", "width", "height"], 1);
    }
    fromJson(json) {
        this.top = json.top || 0;
        this.left = json.left || 0;
        this.width = json.width || this.DEFAULT_WIDTH;
        this.height = json.height || this.DEFAULT_HEIGHT;
    }
}
class FileDialogWindow extends DraggableWindow {
    setDefaultSize() {
        super.setDefaultSize();
        this.DEFAULT_WIDTH = Globals.cfg.FileDialogWindow.DEFAULT_WIDTH;
        this.width = this.DEFAULT_WIDTH;
    }
    selectDirectory() {
        this.cancel();
        this.parent.directorySelected(this.fcs);
    }
    createDirOk() {
        this.build();
    }
    createDirFailed() {
    }
    dirDialogOk() {
        let dirname = this.dirdialogwindow.content;
        let dirpath = this.fcs.abspath("");
        let createdirasset = new AjaxAsset({
            action: "createdir",
            path: dirpath,
            name: dirname
        });
        this.markedpath = undefined;
        new AssetLoader().
            add(createdirasset).
            setcallback(this.createDirOk.bind(this)).
            seterrorcallback(this.createDirFailed.bind(this)).
            load();
    }
    renameDirOk() {
        this.build();
    }
    renameDirFailed() {
    }
    renamedirDialogOk() {
        let dirname = this.dirdialogwindow.content;
        let currentdirname = this.upDir();
        if (currentdirname == undefined)
            return;
        let dirpath = this.fcs.abspath(currentdirname);
        let newdirpath = this.fcs.abspath(dirname);
        let renamedirasset = new AjaxAsset({
            action: "renamefile",
            pathFrom: dirpath,
            pathTo: newdirpath
        });
        this.markedpath = undefined;
        new AssetLoader().
            add(renamedirasset).
            setcallback(this.renameDirOk.bind(this)).
            seterrorcallback(this.renameDirFailed.bind(this)).
            load();
    }
    createDirectory() {
        this.dirdialogwindow = new TextDialogWindow(this.dirdialogId(), this.ld, this.ldi + 1);
        this.dirdialogwindow.
            setOkCallBack(this.dirDialogOk.bind(this)).
            setTitle("Enter directory name").
            build();
    }
    createFileOk() {
        let name = this.dirdialogwindow.content;
        let createpath = this.fcs.abspath(name);
        let createasset = new AjaxAsset({
            action: "writetextfile",
            path: createpath,
            content: ""
        });
        new AssetLoader().
            add(createasset).
            setcallback(this.createOk.bind(this)).
            seterrorcallback(this.createFailed.bind(this)).
            load();
    }
    createOk() {
        this.build();
    }
    createFailed() {
    }
    createFile() {
        this.dirdialogwindow = new TextDialogWindow(this.dirdialogId(), this.ld, this.ldi + 1);
        this.dirdialogwindow.
            setOkCallBack(this.createFileOk.bind(this)).
            setTitle("Enter file name").
            build();
    }
    renameDirectory() {
        this.dirdialogwindow = new TextDialogWindow(this.dirdialogId(), this.ld, this.ldi + 1);
        this.dirdialogwindow.
            setOkCallBack(this.renamedirDialogOk.bind(this)).
            setTitle("Enter directory name").
            build();
    }
    removeDirOk() {
        this.build();
    }
    removeDirFailed() {
    }
    deleteDirectory() {
        let dirname;
        if ((dirname = this.upDir()) != undefined) {
            let dirpath = this.fcs.abspath("");
            let removedirasset = new AjaxAsset({
                action: "removedir",
                path: dirpath,
                name: dirname
            });
            this.markedpath = undefined;
            new AssetLoader().
                add(removedirasset).
                setcallback(this.removeDirOk.bind(this)).
                seterrorcallback(this.removeDirFailed.bind(this)).
                load();
        }
    }
    upDir() {
        if (this.fcs.dirpathl.length == 0)
            return undefined;
        return this.fcs.dirpathl.pop();
    }
    fileNameClicked(file, e) {
        if (file.name == "..") {
            if (this.upDir() != undefined)
                this.build();
        }
        else if (file.isdir) {
            this.fcs.dirpathl.push(file.name);
            this.build();
        }
        else if (file.isfile) {
            this.fcs.name = file.name;
            this.cancel();
            this.parent.directorySelected(this.fcs);
        }
    }
    toolSelected(file, tc, ev) {
        let name = file.name;
        let abspath = this.fcs.abspath(name);
        file.abspath = abspath;
        let command = tc.selectedKey;
        tc.build().selectByIndex(0);
        switch (command) {
            case "view":
                new FileView(file, this.ld, this.ldi + 1).build();
                break;
            case "edit":
                new FileView(file, this.ld, this.ldi + 1).build();
                break;
            case "copy":
            case "copyas":
            case "cut":
            case "cutas":
            case "rename":
                {
                    this.markedpath = abspath;
                    this.markedname = name;
                    this.showMarkedPath();
                    let row = this.filegrid.getRowByColValue("name", name);
                    this.filegrid.unMarkAllRows();
                    this.filegrid.markRow(row);
                    this.markedaction = "copy";
                    if ((command == "cut") || (command == "cutas"))
                        this.markedaction = "cut";
                    if (command == "rename")
                        this.markedaction = "rename";
                    if ((command == "copyas") || (command == "cutas") || (command == "rename")) {
                        this.namedialogwindow = new TextDialogWindow(this.namedialogId(), this.ld, this.ldi + 1);
                        this.namedialogwindow.
                            setOkCallBack(this.nameDialogOk.bind(this)).
                            setTitle("Enter file name").
                            build();
                    }
                }
                ;
                break;
            case "delete": {
                new ConfirmDialogWindow(this.deleteConfirmDialogId(), this.ld, this.ldi + 1).
                    setOkCallBack(this.deleteConfirmOk.bind(this)).
                    setContentInfo(`Are you sure you want to delete ${abspath}?`).
                    setTitle("Confirm delete").
                    build();
                this.deletepath = abspath;
            }
        }
    }
    deleteConfirmOk() {
        this.deleteFile(this.deletepath);
    }
    deleteConfirmDialogId() { return this.id + "_deleteconfirm"; }
    deleteFile(path) {
        let deleteasset = new AjaxAsset({
            action: "deletefile",
            path: path
        });
        this.markedpath = undefined;
        new AssetLoader().
            add(deleteasset).
            setcallback(this.deleteOk.bind(this)).
            seterrorcallback(this.deleteFailed.bind(this)).
            load();
    }
    deleteOk() {
        this.build();
    }
    deleteFailed() {
    }
    nameDialogOk() {
        this.markedname = this.namedialogwindow.content;
        let pastepath = this.fcs.abspath(this.markedname);
        if (this.markedaction == "rename") {
            let pasteasset = new AjaxAsset({
                action: "renamefile",
                pathFrom: this.markedpath,
                pathTo: pastepath
            });
            this.markedpath = undefined;
            new AssetLoader().
                add(pasteasset).
                setcallback(this.pasteOk.bind(this)).
                seterrorcallback(this.pasteFailed.bind(this)).
                load();
        }
        else
            this.showMarkedPath();
    }
    namedialogId() { return this.id + "_namedialog"; }
    dirdialogId() { return this.id + "_dirdialog"; }
    showMarkedPath() {
        this.markedpathdiv.h("").a([
            new e("div").h(this.fcs.fullpath())
        ]);
        if (this.markedpath != undefined) {
            this.markedpathdiv.a([
                new Button("Paste").onClick(this.pasteClicked.bind(this)),
                new e("span").h((this.markedaction == "copy" ? "Copy" : "Cut") + " " + this.markedpath + " as " + this.markedname)
            ]);
        }
    }
    pasteClicked(e) {
        let pastepath = this.fcs.abspath(this.markedname);
        let pasteasset = new AjaxAsset({
            action: this.markedaction == "copy" ? "copyfile" : "movefile",
            pathFrom: this.markedpath,
            pathTo: pastepath
        });
        this.markedpath = undefined;
        new AssetLoader().
            add(pasteasset).
            setcallback(this.pasteOk.bind(this)).
            seterrorcallback(this.pasteFailed.bind(this)).
            load();
    }
    pasteOk() {
        this.build();
    }
    pasteFailed() {
    }
    ajaxok() {
        let json = this.ajaxasset.resjson;
        let files = json.files || [];
        files.unshift({
            ok: true,
            name: "..",
            isdir: true,
            isfile: false,
            parentdir: true,
            stats: {}
        });
        this.filegrid.clearItems();
        let cfg = Globals.cfg.FileDialogWindow;
        let row = 0;
        files.map(file => {
            file.isanydir = file.isdir || file.parentdir;
            file.istruedir = file.isdir && (!file.parentdir);
            let stats = file.stats;
            let kind = `${file.isdir ? "dir" : ""}${file.isfile ? "file" : ""}`;
            this.filegrid.setItem(new SortableGridIndex(row, "type"), new e("div").
                h(kind).k(kind));
            this.filegrid.setItem(new SortableGridIndex(row, "name"), new e("div").
                h(file.name).k(file.name).s("cur", "ptr").
                s("bc", file.istruedir ? cfg.DIR_COL : "initial").
                px("pd", cfg.PADDING).
                ae("md", this.fileNameClicked.bind(this, file)));
            let tc = new ComboBox().addOptions([
                new ComboOption("tools", "Tools"),
                new ComboOption("view", "View"),
                new ComboOption("edit", "Edit"),
                new ComboOption("rename", "Rename"),
                new ComboOption("copy", "Copy"),
                new ComboOption("copyas", "CopyAs"),
                new ComboOption("cut", "Cut"),
                new ComboOption("cutas", "CutAs"),
                new ComboOption("delete", "Delete")
            ]);
            tc.onChange(this.toolSelected.bind(this, file, tc)).
                build();
            if ((!file.parentdir) && (file.isfile))
                this.filegrid.setItem(new SortableGridIndex(row, "tools"), new e("div").
                    a([
                    tc
                ]));
            this.filegrid.setItem(new SortableGridIndex(row, "modified"), new e("div").
                h(stats.mtime).k(stats.mtime));
            this.filegrid.setItem(new SortableGridIndex(row, "size"), new e("div").
                h(file.isanydir ? "" : stats.size).k(stats.size).px("w", cfg.SIZE_WIDTH).
                s("text-align", "right"));
            row++;
        });
        this.filegrid.build();
    }
    ajaxfailed() {
        console.log("ajax failed");
    }
    listFiles() {
        let path = this.fcs.abspath("");
        this.ajaxasset = new AjaxAsset({
            action: "listdir",
            path: path
        });
        new AssetLoader().
            add(this.ajaxasset).
            setcallback(this.ajaxok.bind(this)).
            seterrorcallback(this.ajaxfailed.bind(this)).
            load();
    }
    sortableGridId() { return this.id + "_grid"; }
    build() {
        let cfg = Globals.cfg.FileDialogWindow;
        this.setWidgetHeight(cfg.WIDGET_HEIGHT);
        super.build();
        this.filegrid = new SortableGrid(this.sortableGridId());
        this.keys = [
            new SortableGridKey("type", this.filegrid),
            new SortableGridKey("name", this.filegrid),
            new SortableGridKey("tools", this.filegrid),
            new SortableGridKey("modified", this.filegrid),
            new SortableGridKey("size", this.filegrid)
        ];
        this.filegrid.setKeys(this.keys).setNumFixed(1).build();
        this.contentdiv.a([
            this.filegrid
        ]);
        this.markedpathdiv = this.widgetdiv;
        this.showMarkedPath();
        this.listFiles();
        return this;
    }
    constructor(id, ld, i, fcs, parent) {
        super(id, ld, i);
        this.fcs = fcs;
        this.parent = parent;
        this.buttons.push(["Select Directory", this.selectDirectory.bind(this)]);
        this.buttons.push(["Create Directory", this.createDirectory.bind(this)]);
        this.buttons.push(["Create File", this.createFile.bind(this)]);
        this.buttons.push(["Rename Directory", this.renameDirectory.bind(this)]);
        this.buttons.push(["Delete Directory", this.deleteDirectory.bind(this)]);
    }
}
class TextDialogWindow extends DraggableWindow {
    constructor(id, ld, i) {
        super(id, ld, i);
        this.content = "";
        this.textinput = new TextInput(this.textInputId());
        this.buttons.push(["Ok", this.okClicked.bind(this)]);
    }
    build() {
        let cfg = Globals.cfg.TextDialogWindow;
        this.height = cfg.HEIGHT;
        super.build();
        this.textinput.px("mgt", cfg.TEXTINPUT_PADDING).px("mgl", cfg.TEXTINPUT_PADDING);
        this.contentdiv.h("").a([
            this.textinput
        ]);
        setTimeout(((e) => {
            this.textinput.focus();
        }).bind(this), cfg.FOCUS_TIMEOUT);
        return this;
    }
    okClicked(e) {
        this.content = this.textinput.getText();
        this.ld.closeLayer(this.ldi);
        if (this.okcallback != undefined)
            this.okcallback();
    }
    setText(content) {
        this.textinput.setText(content);
        return this;
    }
    textInputId() { return this.id + "_textinput"; }
    setOkCallBack(okcallback) {
        this.okcallback = okcallback;
        return this;
    }
}
class ConfirmDialogWindow extends DraggableWindow {
    build() {
        let cfg = Globals.cfg.ConfirmDialogWindow;
        this.height = cfg.HEIGHT;
        super.build();
        this.contentdiv.h("").a([
            new e("div").h(this.contentinfo).px("mg", cfg.CONTENT_MARGIN)
        ]);
        return this;
    }
    okClicked(e) {
        this.ld.closeLayer(this.ldi);
        if (this.okcallback != undefined)
            this.okcallback();
    }
    setContentInfo(contentinfo) {
        this.contentinfo = contentinfo;
        return this;
    }
    setOkCallBack(okcallback) {
        this.okcallback = okcallback;
        return this;
    }
    constructor(id, ld, i) {
        super(id, ld, i);
        this.buttons.push(["Ok", this.okClicked.bind(this)]);
    }
}
class FileChooser extends e {
    constructor(id, ld, li) {
        super("table", id);
        this.ld = ld;
        this.li = li;
        this.state = new FileChooserState(this.fileChooserStateId());
        this.state.fromStored();
    }
    fileChooserStateId() { return this.id + "_state"; }
    driveButtonId() { return this.id + "_drive"; }
    directorySelected(fcs) {
        this.state = fcs;
        this.build();
    }
    selectButtonClicked() {
        let cstate = new FileChooserState(this.fileChooserStateId());
        cstate.copyFrom(this.state);
        new FileDialogWindow("File", this.ld, this.li, cstate, this).
            setTitle("Select file / directory").
            build();
    }
    driveDialogId() { return this.id + "_drivedialog"; }
    driveEdited(e) {
        this.state.drive = this.driveDialog.content;
        this.build();
    }
    driveButtonClicked(e) {
        this.driveDialog = new TextDialogWindow(this.driveDialogId(), this.ld, this.li).
            setOkCallBack(this.driveEdited.bind(this)).
            setText(this.state.drive);
        this.driveDialog.
            setTitle("Enter drive").
            build();
    }
    build() {
        let cfg = Globals.cfg.FileChooser;
        this.px("bs", cfg.TABLE_BS).s("bcs", "separate").h().a([
            new e("tr").a([
                new e("td").a([
                    new Button(this.state.drive).onClick(this.driveButtonClicked.bind(this)).
                        onClick(this.driveButtonClicked.bind(this))
                ]),
                new e("td").s("ff", "ms").a([
                    new e("div").px("w", cfg.PATH_WIDTH).s("ovf", "hidden").s("text-align", "left").
                        s("text-overflow", "ellipsis").s("direction", "rtl").
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
        ]);
        this.state.store();
        return this;
    }
    nameDialogId() { return this.id + "_namedialog"; }
    nameEdited(e) {
        this.state.name = this.nameDialog.content;
        this.build();
    }
    nameButtonClicked(e) {
        this.nameDialog = new TextDialogWindow(this.nameDialogId(), this.ld, this.li).
            setOkCallBack(this.nameEdited.bind(this)).
            setText(this.state.name);
        this.nameDialog.
            setTitle("Enter file name").
            build();
    }
}
class GitBrowser extends e {
    constructor() {
        super("div");
        this.tokensById = {};
    }
    usersLoaded(ok, result) {
        if (ok) {
            let json = JSON.parse(result.content);
            this.users = json.gitusers;
            this.build();
        }
    }
    scan() {
        this.user = this.usercombo.selectedKey;
        this.password = this.passwordtext.getText();
        this.auth = {
            username: this.user,
            password: this.password
        };
        this.config = {
            auth: this.auth
        };
    }
    listReposResult(ok, result) {
        if (ok) {
            let repos = result.result;
            this.repocombo.clear().addOptions(repos.map(repo => new ComboOption(repo.name, repo.name))).
                selectByIndex(0).build();
        }
    }
    gitApiRequest(url, callback, method = "get", data = null) {
        this.scan();
        this.config.method = method;
        let body = {
            action: "githubapi",
            url: url,
            config: this.config
        };
        if (data != null) {
            body.config.data = data;
        }
        console.log("gitApiRequest", body);
        new AjaxRequest(body, callback);
    }
    listReposClicked(e) {
        this.gitApiRequest("user/repos", this.listReposResult.bind(this));
    }
    createTokenResult(ok, result) {
        if (ok) {
            let data = result.result;
            this.tokensById[data.id] = data.token;
            this.listTokensClicked(null);
        }
    }
    createToken(scopes) {
        let rnd = Math.floor(Math.random() * 10000);
        let tokenName = `token_${rnd}`;
        this.gitApiRequest("authorizations", this.createTokenResult.bind(this), "post", {
            scopes: scopes,
            note: tokenName
        });
    }
    listTokensResult(ok, result) {
        if (ok) {
            let data = result.result.reverse();
            this.tokencombo.clear().addOptions(data.map(token => new ComboOption(token.id, `${token.id} ${token.note} ${token.scopes.join(",")} ${this.tokensById[token.id]}`))).selectByIndex(0).build();
            if (this.resetRepo != undefined) {
                this.deleteRepoClicked(null);
            }
        }
    }
    listTokensClicked(e) {
        this.gitApiRequest("authorizations", this.listTokensResult.bind(this));
    }
    deleteTokenResult(ok, result) {
        if (ok) {
            this.listTokensClicked(null);
        }
    }
    deleteTokenClicked(e) {
        let id = this.tokencombo.selectedKey;
        this.gitApiRequest("authorizations/" + id, this.deleteTokenResult.bind(this), "delete");
    }
    deleteRepoResult(ok, result) {
        if (ok) {
            this.listReposClicked(null);
            if (this.resetRepo != undefined) {
                this.repotext.setText(this.resetRepo);
                this.createRepoClicked(null);
            }
        }
    }
    deleteRepoClicked(e) {
        let tokenid = this.tokencombo.selectedKey;
        if (tokenid != null) {
            let token = this.tokensById[tokenid];
            if (token != undefined) {
                let user = this.usercombo.selectedKey;
                let repo = this.repocombo.selectedKey;
                if ((user != null) && (repo != null)) {
                    let url = "repos/" + user + "/" + repo + "?access_token=" + token;
                    this.gitApiRequest(url, this.deleteRepoResult.bind(this), "delete");
                }
            }
        }
    }
    createRepoResult(ok, result) {
        if (ok) {
            this.repotext.setText("");
            this.listReposClicked(null);
            if (this.resetRepo != undefined) {
                this.resetRepo = undefined;
                this.deleteTokenClicked(null);
            }
        }
    }
    createRepoClicked(e) {
        let repoName = this.repotext.getText();
        if (repoName != "") {
            this.gitApiRequest("user/repos", this.createRepoResult.bind(this), "post", {
                name: repoName
            });
        }
    }
    resetRepoClicked(e) {
        let repo = this.repocombo.selectedKey;
        if (repo != null) {
            this.resetRepo = repo;
            this.createToken(["delete_repo"]);
        }
    }
    build() {
        this.px("bs", 5).s("bcs", "separate").h("").a([
            new e("tr").a([
                new e("td").h("Password : ").a([
                    this.passwordtext = new PasswordInput()
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.usercombo = new ComboBox("gitbrowser").build()
                ]),
                new e("td").a([
                    new Button("List repos").onClick(this.listReposClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.repocombo = new ComboBox("repobrowser").build()
                ]),
                new e("td").a([
                    new Button("Delete repo").onClick(this.deleteRepoClicked.bind(this))
                ]),
                new e("td").a([
                    new Button("Reset repo").onClick(this.resetRepoClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.repotext = new TextInput()
                ]),
                new e("td").a([
                    new Button("Create repo").onClick(this.createRepoClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    new Button("Create delete_repo token").onClick(this.createToken.bind(this, ["delete_repo"]))
                ]),
                new e("td").a([
                    new Button("List tokens").onClick(this.listTokensClicked.bind(this))
                ])
            ]),
            new e("tr").a([
                new e("td").a([
                    this.tokencombo = new ComboBox("tokenbrowser").build()
                ]),
                new e("td").a([
                    new Button("Delete token").onClick(this.deleteTokenClicked.bind(this))
                ])
            ])
        ]);
        this.tokencombo.px("w", 300);
        if (this.users == undefined) {
            new AjaxRequest({
                action: "readtextfile",
                path: "gitusers.json"
            }, this.usersLoaded.bind(this));
        }
        else {
            this.usercombo.clear().addOptions(this.users.map(user => new ComboOption(user, user))).selectByIndex(0).build();
        }
        return this;
    }
}
class Tab {
    constructor(id, caption, e) {
        this.id = id;
        this.caption = caption;
        this.e = e;
    }
}
class TabPane extends e {
    constructor(id) {
        super("div", id);
        this.width = 600;
        this.height = 400;
        this.tabs = [];
        this.selectedIndex = 0;
        this.fromStored();
    }
    toJsonText() {
        return JSON.stringify({
            selectedIndex: this.selectedIndex
        });
    }
    fromJson(json) {
        this.selectedIndex = json.selectedIndex;
    }
    setWidth(width) {
        this.width = width;
        return this;
    }
    setHeight(height) {
        this.height = height;
        return this;
    }
    setTabs(tabs) {
        this.tabs = tabs;
        return this;
    }
    selectByKey(key) {
        return this.selectByIndex(this.getIndexById(key));
    }
    selectByIndex(index) {
        if (index < 0)
            return this;
        if (index < this.tabs.length) {
            let cfg = Globals.cfg.TabPane;
            this.selectedIndex = index;
            this.contentDiv = new e("div").
                z(this.width - cfg.CONTENTDIV_SHRINK_WIDTH, this.height - cfg.CONTENTDIV_SHRINK_HEIGHT).
                s("bc", cfg.CONTENTDIV_BCOL).s("ovf", "scr").a([
                this.tabs[index].e
            ]);
            this.contentTd.h("").a([this.contentDiv]);
            for (let i = 0; i < this.tabs.length; i++) {
                this.tabs[i].captione.s("bc", i == this.selectedIndex ?
                    cfg.TAB_SEL_BCOL : cfg.TAB_BCOL);
            }
            this.store();
        }
        return this;
    }
    getIndexById(id) {
        for (let tabi in this.tabs) {
            if (this.tabs[tabi].id == id)
                return parseInt(tabi);
        }
        return -1;
    }
    tabClicked(tab, e) {
        let index = this.getIndexById(tab.id);
        this.selectByIndex(index);
    }
    build() {
        let cfg = Globals.cfg.TabPane;
        this.z(this.width, this.height).s("bc", cfg.TABPANE_BCOL);
        this.table = new e("table").px("bs", cfg.TABLE_BORDER_SEP).s("bcs", "separate").a([
            new e("tr").a(this.tabs.map(tab => tab.captione = new e("td").h(tab.caption).s("cur", "ptr").
                px("pd", cfg.TAB_PADDING).s("bc", cfg.TAB_BCOL).
                ae("md", this.tabClicked.bind(this, tab)))),
            new e("tr").a([
                this.contentTd = new e("td").t("colspan", "" + this.tabs.length)
            ])
        ]);
        this.h("").a([
            this.table
        ]);
        return this.selectByIndex(this.selectedIndex);
    }
}
class LogPane extends e {
    constructor() {
        super("div");
        this.logger = new Misc.Logger();
        this.s("ff", "ms");
    }
    log(li) {
        this.logger.log(li);
        this.h(this.logger.reportHtml());
    }
}
class GrayScale extends e {
    constructor() {
        super("div");
        this.pixels = new Array(this.AREA());
    }
    AREA() { return this.WIDTH_PIXEL() * this.HEIGHT_PIXEL(); }
    PIXEL_WIDTH() { return Globals.cfg.GrayScale.PIXEL_WIDTH; }
    HEIGHT_PIXEL() { return Globals.cfg.GrayScale.HEIGHT_PIXEL; }
    WIDTH_PIXEL() { return Globals.cfg.GrayScale.WIDTH_PIXEL; }
    totalImgWidth() { return this.PIXEL_WIDTH() * this.WIDTH_PIXEL(); }
    totalImgHeight() { return this.PIXEL_WIDTH() * this.HEIGHT_PIXEL(); }
    fromData(data) {
        this.pixels = data[0];
        return this;
    }
    randClicked(e) {
        let data = Globals.neural;
        let size = data.length;
        let r = Math.floor(Math.random() * size);
        this.fromData(data[r]);
        this.build();
    }
    build() {
        this.imgdiv = new e("div").pr().z(this.totalImgWidth(), this.totalImgHeight());
        for (let r = 0; r < this.HEIGHT_PIXEL(); r++) {
            for (let c = 0; c < this.WIDTH_PIXEL(); c++) {
                let pdiv = new e("div").pa().r(c * this.PIXEL_WIDTH(), r * this.PIXEL_WIDTH(), this.PIXEL_WIDTH(), this.PIXEL_WIDTH()).s("bc", Misc.grayScaleToRgb(this.pixels[r * this.WIDTH_PIXEL() + c]));
                this.imgdiv.a([
                    pdiv
                ]);
            }
        }
        this.h("").z(this.totalImgWidth(), this.totalImgHeight()).px("pd", 2).s("bc", "#00f").a([
            this.imgdiv /*,
            new Button("Rand").onClick(this.randClicked.bind(this)).px("mg",10)*/
        ]);
        return this;
    }
}
class DigitEditor extends e {
    constructor() {
        super("table");
        this.down = false;
        this.pixels = new Array(this.AREA());
    }
    setRecognizeCallback(recognizeCallback) {
        this.recognizeCallback = recognizeCallback;
        return this;
    }
    AREA() { return this.WIDTH_PIXEL() * this.HEIGHT_PIXEL(); }
    PIXEL_WIDTH() { return Globals.cfg.DigitEditor.PIXEL_WIDTH; }
    HEIGHT_PIXEL() { return Globals.cfg.DigitEditor.HEIGHT_PIXEL; }
    WIDTH_PIXEL() { return Globals.cfg.DigitEditor.WIDTH_PIXEL; }
    totalImgWidth() { return this.PIXEL_WIDTH() * this.WIDTH_PIXEL(); }
    totalImgHeight() { return this.PIXEL_WIDTH() * this.HEIGHT_PIXEL(); }
    fromData(data) {
        this.pixels = data[0];
        return this;
    }
    clearClicked(e) {
        for (let i = 0; i < this.AREA(); i++) {
            this.pixels[i] = 0;
        }
        this.down = false;
        this.build();
    }
    imgMouseDown(e) {
        this.down = true;
        this.imgMouseMove(e);
    }
    imgMouseMove(e) {
        if (!this.down)
            return;
        let me = e;
        let cr = this.imgdiv.e.getBoundingClientRect();
        let imgorig = new Vectors.Vect(cr.left, cr.top);
        let mousepos = new Vectors.Vect(me.clientX, me.clientY);
        let relpos = mousepos.m(imgorig).s(1 / this.PIXEL_WIDTH());
        let x = Math.floor(relpos.x);
        let y = Math.floor(relpos.y);
        let i = x + y * this.WIDTH_PIXEL();
        this.pixels[i] = 1;
        this.build();
    }
    imgMouseUp(e) {
        this.down = false;
    }
    imgMouseOut(e) {
        this.down = false;
    }
    recognizeClicked(e) {
        this.down = false;
        this.recognizeCallback();
    }
    build() {
        this.imgdiv = new e("div").pr().z(this.totalImgWidth(), this.totalImgHeight()).
            ae("mousedown", this.imgMouseDown.bind(this)).
            ae("mousemove", this.imgMouseMove.bind(this)).
            ae("mouseup", this.imgMouseUp.bind(this)).
            ae("mouseout", this.imgMouseOut.bind(this));
        for (let r = 0; r < this.HEIGHT_PIXEL(); r++) {
            for (let c = 0; c < this.WIDTH_PIXEL(); c++) {
                let pdiv = new e("div").pa().r(c * this.PIXEL_WIDTH(), r * this.PIXEL_WIDTH(), this.PIXEL_WIDTH(), this.PIXEL_WIDTH()).s("bc", Misc.grayScaleToRgb(this.pixels[r * this.WIDTH_PIXEL() + c])).
                    ae("mouseout", (e) => { e.stopPropagation(); });
                this.imgdiv.a([
                    pdiv
                ]);
            }
        }
        this.px("bs", 3).s("bcs", "separate").h("").z(this.totalImgWidth(), this.totalImgHeight()).px("pd", 4).s("bc", "#aaa").a([
            new e("tr").a([
                new e("td").a([
                    this.imgdiv,
                    new Button("Clear").onClick(this.clearClicked.bind(this)).px("mg", 10),
                    new Button("Recognize").onClick(this.recognizeClicked.bind(this)).px("mg", 10)
                ]),
                new e("td").s("vertical-align", "top").a([
                    this.resultdiv = new e("div").px("fs", 220).z(160, 200).px("mgl", 50)
                ])
            ])
        ]);
        return this;
    }
}
class TrainLoader {
    constructor(label, max) {
        this.currentI = 0;
        this.neurals = [];
        this.label = label;
        this.max = max;
    }
    loadIOk() {
        this.neurals.push(this.neuralAsset.asJson());
        this.currentI++;
        if (this.currentI < this.max)
            setTimeout(this.loadI.bind(this), 5000);
    }
    loadI() {
        this.neuralAsset = new TextAsset(`assets/neural2/${this.label}/${this.label}.${this.currentI}.json`);
        new AssetLoader().
            add(this.neuralAsset).
            setcallback(this.loadIOk.bind(this)).
            load();
        return this;
    }
}
class Neuron {
    constructor() {
        ////////////////////////////
        this.bias = 0;
        this.a = 0;
        ////////////////////////////
        this.selected = false;
    }
    setBias(bias) {
        this.bias = bias;
        return this;
    }
    setActivation(a) {
        this.a = a;
        return this;
    }
}
class Layer {
    constructor() {
        ////////////////////////////
        this.neurons = [];
    }
    get length() {
        return this.neurons.length;
    }
    add(n) {
        this.neurons.push(n);
        return this;
    }
}
class Weight {
    ////////////////////////////
    constructor(w = 0) {
        ////////////////////////////
        this.w = 0;
        this.w = w;
    }
}
class WeightIndex {
    ////////////////////////////
    constructor(fromLayerIndex, fromNeuronIndexIndex, toLayerIndex, toNeuronIndex) {
        this.fromLayerIndex = fromLayerIndex;
        this.fromNeuronIndexIndex = fromNeuronIndexIndex;
        this.toLayerIndex = toLayerIndex;
        this.toNeuronIndex = toNeuronIndex;
    }
    key() {
        return `${this.fromLayerIndex},${this.fromNeuronIndexIndex},${this.toLayerIndex},${this.toNeuronIndex}`;
    }
}
class LayerConfigItem extends e {
    constructor(n, margin, spacing) {
        super("table");
        this.px("bs", 2).s("bcs", "separate").a([new e("tr").a([
                new e("td").h("n:"),
                new e("td").a([
                    this.nInput = new TextInput().setText("" + n).px("w", 30)
                ]),
                new e("td").px("pdl", 5).px("fs", 10).h("margin:"),
                new e("td").a([
                    this.marginInput = new TextInput().setText("" + margin).px("w", 30)
                ]),
                new e("td").px("pdl", 5).px("fs", 10).h("spacing:"),
                new e("td").a([
                    this.spacingInput = new TextInput().setText("" + spacing).px("w", 30)
                ])
            ])]);
    }
}
class NeuralNet extends e {
    constructor(id, ld, li) {
        super("div", id);
        ////////////////////////////
        ////////////////////////////
        // network        
        this.sizes = [];
        this.weights = [];
        this.biases = [];
        this.activations = [];
        this.zs = [];
        ////////////////////////////
        this.cons = {};
        this.layers = [];
        this.config = {};
        this.error_squared = null;
        this.epochIndex = 0;
        this.setI = 0;
        this.validationInfo = {};
        this.randomIndex = 0;
        this.logicout = [];
        this.ld = ld;
        this.li = li;
        this.setConfig({
            eta: 0.01,
            lambda: 0.000001,
            showWeights: false,
            layers: [
                {
                    n: 196
                },
                {
                    n: 40
                },
                {
                    n: 10
                }
            ]
        });
    }
    layerConfigApplyCallback() {
        this.config.layers = this.layerconfig.list.map(item => ({
            n: parseInt(item.nInput.getText()),
            margin: parseInt(item.marginInput.getText()),
            spacing: parseInt(item.spacingInput.getText())
        }));
        this.setConfig(this.config).build();
        this.tabs.selectByKey("config");
    }
    layerMargin(layerIndex) {
        let m = this.config.layers[layerIndex].margin;
        return m == undefined ? 0 : m;
    }
    layerSpacing(layerIndex) {
        let s = this.config.layers[layerIndex].spacing;
        return s == undefined ? 1 : s;
    }
    setConfig(config) {
        this.config = config;
        this.layers = [];
        this.cons = {};
        for (let i = 0; i < config.layers.length; i++) {
            let cl = config.layers[i];
            this.createLayer(i, cl.n);
        }
        return this;
    }
    nCoords(layerIndex, neuronIndex) {
        return new Vectors.ScreenVector(layerIndex * this.cfg.NEURON_WIDTH, neuronIndex * this.cfg.NEURON_HEIGHT * this.layerSpacing(layerIndex) +
            this.layerMargin(layerIndex) * this.cfg.NEURON_HEIGHT);
    }
    nmCoords(layerIndex, neuronIndex) {
        let c = this.nCoords(layerIndex, neuronIndex);
        return new Vectors.ScreenVector(c.x + this.cfg.NEURON_MLEFT + this.cfg.NEURON_DIAMETER / 2, c.y + this.cfg.NEURON_MTOP + this.cfg.NEURON_DIAMETER / 2);
    }
    nmCoordsEmit(layerIndex, neuronIndex) {
        let c = this.nmCoords(layerIndex, neuronIndex);
        return new Vectors.ScreenVector(c.x + this.cfg.NEURON_DIAMETER / 2, c.y);
    }
    nmCoordsReceive(layerIndex, neuronIndex) {
        let c = this.nmCoords(layerIndex, neuronIndex);
        return new Vectors.ScreenVector(c.x - this.cfg.NEURON_DIAMETER / 2, c.y);
    }
    getWeight(fromLayerIndex, fromNeuronIndexIndex, toLayerIndex, toNeuronIndex) {
        return this.cons[new WeightIndex(fromLayerIndex, fromNeuronIndexIndex, toLayerIndex, toNeuronIndex).key()];
    }
    setWeight(fromLayerIndex, fromNeuronIndexIndex, toLayerIndex, toNeuronIndex, w) {
        let key = new WeightIndex(fromLayerIndex, fromNeuronIndexIndex, toLayerIndex, toNeuronIndex).key();
        if (w != null)
            this.cons[key] = w;
        else
            delete this.cons[key];
    }
    getNeuron(layerIndex, neuronIndex) {
        let neuron = this.layers[layerIndex].neurons[neuronIndex];
        if (this.activations.length < layerIndex)
            return neuron;
        neuron.setActivation(Misc.getMathIJ(this.activations, layerIndex, neuronIndex));
        neuron.setBias(Misc.getMathIJ(this.biases, layerIndex - 1, neuronIndex));
        return neuron;
    }
    neuronClicked(layerIndex, neuronIndex, e) {
        let neuron = this.layers[layerIndex].neurons[neuronIndex];
        if (this.opselector.selectedIndex >= 0) {
            neuron.selected = !neuron.selected;
            let button = this.opselector.buttons[this.opselector.selectedIndex];
            neuron.selectedfor = button.key;
            let sbcol = button.bcol;
            let bcol = neuron.selected ? sbcol : this.cfg.NEURON_BCOL;
            neuron.div.s("bc", bcol);
        }
    }
    iterateCons(iterfunc) {
        for (let fromLayerIndex = 0; fromLayerIndex < this.layers.length; fromLayerIndex++) {
            let fromLayer = this.layers[fromLayerIndex];
            for (let fromNeuronIndex = 0; fromNeuronIndex < fromLayer.length; fromNeuronIndex++) {
                for (let toLayerIndex = 0; toLayerIndex < this.layers.length; toLayerIndex++) {
                    let toLayer = this.layers[toLayerIndex];
                    for (let toNeuronIndex = 0; toNeuronIndex < toLayer.length; toNeuronIndex++) {
                        let fromNeuron = fromLayer.neurons[fromNeuronIndex];
                        let toNeuron = toLayer.neurons[toNeuronIndex];
                        iterfunc(fromLayerIndex, fromLayer, fromNeuronIndex, fromNeuron, toLayerIndex, toLayer, toNeuronIndex, toNeuron);
                    }
                }
            }
        }
    }
    clearSelections() {
        this.iterateNeurons((layerIndex, neuronIndex, neuron) => {
            neuron.selected = false;
        });
    }
    clearSelectionsClicked(e) {
        this.clearSelections();
        this.build();
    }
    connectClicked(on, e) {
        this.iterateCons((fromLayerIndex, fromLayer, fromNeuronIndex, fromNeuron, toLayerIndex, toLayer, toNeuronIndex, toNeuron) => {
            if (fromNeuron.selected && toNeuron.selected &&
                (fromNeuron.selectedfor == "from") && (toNeuron.selectedfor == "to"))
                this.setWeight(fromLayerIndex, fromNeuronIndex, toLayerIndex, toNeuronIndex, on ? new Weight(1) : null);
        });
        this.clearSelectionsClicked(null);
    }
    layerClicked(layerIndex, e) {
        if (this.opselector.selectedIndex >= 0) {
            let l = this.layers[layerIndex];
            for (let neuronIndex = 0; neuronIndex < l.length; neuronIndex++) {
                this.neuronClicked(layerIndex, neuronIndex, null);
            }
        }
    }
    iterateNeurons(iterfunc) {
        for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
            let l = this.layers[layerIndex];
            for (let neuronIndex = 0; neuronIndex < l.length; neuronIndex++) {
                let neuron = l.neurons[neuronIndex];
                iterfunc(layerIndex, neuronIndex, neuron);
            }
        }
    }
    toJsonText() {
        return JSON.stringify(this, (key, value) => {
            if (["id", "key", "e", "selected", "div", "selectedfor", "netdiv", "graphdiv", "neurondiv",
                "layerdiv", "ld", "li", "cfg", "opselector", "fc", "jsondiv", "tabs", "configdiv",
                "configtextarea", "errorLabel", "error_squared", "layerconfig", "trainloader",
                "validationloader", "editordiv"]
                .indexOf(key) < 0) {
                return value;
            }
            else
                return undefined;
        }, 2);
    }
    showJson(content) {
        this.jsondiv.h(`<pre>${content}</pre>`);
    }
    saveClicked(e) {
        let path = this.fc.state.abspath();
        let content = this.toJsonText();
        new AjaxRequest({
            action: "writetextfile",
            path: path,
            content: content
        }, () => {
            this.showJson(content);
            this.tabs.selectByKey("json");
        });
    }
    fromJson(json) {
        this.layers = [];
        this.cons = {};
        for (let layerIndex in json.layers) {
            let l = new Layer();
            this.layers.push(l);
            json.layers[layerIndex].neurons.map(neuron => l.add(new Neuron().
                setBias(neuron.bias).
                setActivation(neuron.a)));
        }
        for (let id in json.cons) {
            let jsonw = json.cons[id];
            this.cons[id] = new Weight(jsonw.w);
        }
        this.config = json.config;
        this.sizes = json.sizes;
        this.weights = [];
        for (let i = 0; i < json.weights.length; i++) {
            let data = json.weights[i].data || json.weights[i]._data;
            this.weights.push(math.matrix(data));
        }
        this.biases = [];
        for (let i = 0; i < json.biases.length; i++) {
            let data = json.biases[i].data || json.biases[i]._data;
            this.biases.push(math.matrix(data));
        }
        this.build();
    }
    fromJsonText(jsontext) {
        this.fromJson(JSON.parse(jsontext));
    }
    loadClicked(e) {
        let path = this.fc.state.abspath();
        new AjaxRequest({
            action: "readtextfile",
            path: path
        }, (ok, result) => {
            if (ok) {
                if (!result.error) {
                    let content = result.content;
                    this.showJson(content);
                    this.fromJsonText(content);
                }
            }
        });
    }
    getInputLayer() { return this.layers[0]; }
    randomInputs() {
        for (let n of this.getInputLayer().neurons) {
            n.a = Misc.randLabel();
        }
    }
    configApplyClicked(e) {
        let configtext = this.configtextarea.getText();
        let config = JSON.parse(configtext);
        this.setConfig(config);
        this.build();
        this.tabs.selectByKey("graph");
    }
    tabsId() { return this.id + "_tabs"; }
    createLayer(index, size) {
        let l = new Layer();
        for (let i = 0; i < size; i++)
            l.add(new Neuron());
        this.layers[index] = l;
        return this;
    }
    errorStr() {
        if (this.error_squared == null)
            return "?";
        return JSON.stringify(this.error_squared._data) + " " + this.epochIndex + " : " + this.setI;
    }
    layerConfigFactory() {
        return new LayerConfigItem(1, 0, 1);
    }
    getInputActivationArray() {
        let a = this.activations.length > 0 ? this.activations[0] : math.matrix().resize([this.config.layers[0].n, 1]);
        let array = Misc.getData(a).map(row => row[0]);
        return array;
    }
    recognize() {
        let vd = [this.digiteditor.pixels];
        this.validationInfo = { n: 0, ok: 0 };
        this.validate(vd);
        let d = this.validationInfo.y[0][0];
        this.digiteditor.resultdiv.h("" + d);
    }
    buildDivs(cfg) {
        if (this.tabs == undefined) {
            this.neurondiv = new e("div").pr();
            this.layerdiv = new e("div").pr();
            this.netdiv = new e("div").pr();
            this.graphdiv = new e("div").pr();
            this.editordiv = new e("div").pr();
            this.configdiv = new e("div").pr();
            this.layerconfig = new EditableList().
                setApplyCallback(this.layerConfigApplyCallback.bind(this)).
                setFactory(this.layerConfigFactory).
                setTitle(new e("div").
                px("pd", 5).
                s("bc", "#afa").
                h("Layer configuration")).
                setIndexDecorator(i => `<font size="1">Layer ${i}.</font>`);
        }
        this.neurondiv.h("").z(cfg.NEURON_WIDTH * cfg.MAX_NUM_LAYERS, cfg.NEURON_HEIGHT * cfg.MAX_LAYER_SIZE).s("bc", cfg.NEURALNET_BCOL).pr();
        this.layerdiv.h("").z(cfg.NEURON_WIDTH * cfg.MAX_NUM_LAYERS, cfg.LAYERDIV_HEIGHT).s("bc", cfg.LAYERDIV_BCOL).pr();
        this.netdiv.h("").z(cfg.NEURON_WIDTH * cfg.MAX_NUM_LAYERS, cfg.NETDIV_HEIGHT).s("bc", cfg.NETDIV_BCOL).pr();
        this.opselector = new RadioButtons().setButtons([
            new RadioButton("from", "From", cfg.OPSELECTOR_FROMCOL),
            new RadioButton("to", "To", cfg.OPSELECTOR_TOCOL)
        ]);
        this.fc = new FileChooser("netfc", this.ld, this.li);
        this.netdiv.a([
            new e("table").px("bs", cfg.NETDIV_BS).s("bcs", "separate").a([
                new e("tr").a([
                    new e("td").a([
                        this.opselector.build()
                    ]),
                    new e("td").a([
                        new Button("Connect").onClick(this.connectClicked.bind(this, true)),
                        new Button("Disconnect").onClick(this.connectClicked.bind(this, false)),
                        new Button("Clear").onClick(this.clearSelectionsClicked.bind(this))
                    ]),
                    new e("td").a([
                        new Button("Save").onClick(this.saveClicked.bind(this)),
                        new Button("Load").onClick(this.loadClicked.bind(this)),
                        new Button("Init").onClick(this.initClicked.bind(this)),
                        new Button("BackProp").onClick(this.backPropClicked.bind(this, 1)),
                        new Button("BackProp1000").onClick(this.backPropClicked.bind(this, 1000)),
                        new Button("Train25").onClick(this.trainClicked.bind(this, 25)),
                        new Button("Train250").onClick(this.trainClicked.bind(this, 250))
                    ])
                ]),
                new e("tr").a([
                    new e("td").t("cs", "2").a([
                        this.fc.build()
                    ]),
                    new e("td").a([
                        this.errorLabel = new e("label").h(this.errorStr())
                    ])
                ]),
                new e("tr").a([
                    new e("td").a([
                        this.grayscale = new GrayScale().fromData([this.getInputActivationArray()]).build()
                    ]),
                    new e("td").s("vertical-align", "middle").a([
                        new e("div").h(JSON.stringify(this.logicout))
                    ]),
                    new e("td").s("vertical-align", "middle").a([
                        new Button("ValidateOne").onClick(this.validateClicked.bind(this, 1)),
                        new Button("Validate").onClick(this.validateClicked.bind(this, 10)),
                        new e("div").h(JSON.stringify(this.validationInfo)).s("float", "right")
                    ]),
                ])
            ])
        ]);
        this.digiteditor = new DigitEditor().
            fromData([this.getInputActivationArray()]).
            setRecognizeCallback(this.recognize.bind(this)).
            build().px("mg", 10);
        this.graphdiv.h("").a([
            this.netdiv,
            this.layerdiv,
            this.neurondiv
        ]);
        this.editordiv.h("").a([
            this.digiteditor
        ]);
        this.configdiv.h("").a([
            new Button("Apply").
                onClick(this.configApplyClicked.bind(this)),
            new e("br"),
            this.configtextarea = new TextArea()
        ]);
        this.configtextarea.
            setText(JSON.stringify(this.config, null, 2)).
            z(cfg.CONFIGTEXT_WIDTH, cfg.CONFIGTEXT_HEIGHT);
        let layerConfigList = this.config.layers.map(layer => {
            return new LayerConfigItem(layer.n, layer.margin || 0, layer.spacing || 1);
        });
        this.layerconfig.setList(layerConfigList).build();
        if (this.tabs == undefined) {
            this.jsondiv = new e("div").s("ff", "ms");
            this.tabs = new TabPane(this.tabsId()).
                setWidth(cfg.TABS_WIDTH).
                setHeight(cfg.TABS_HEIGHT).
                setTabs([
                new Tab("graph", "Graph", this.graphdiv),
                new Tab("editor", "Editor", this.editordiv),
                new Tab("config", "Config", this.configdiv),
                new Tab("layerconfig", "LayerConfig", this.layerconfig),
                new Tab("json", "JSON", this.jsondiv)
            ]).build();
            this.a([this.tabs]);
        }
    }
    buildNeurons(cfg) {
        for (let layerIndex = 0; layerIndex < this.layers.length; layerIndex++) {
            let l = this.layers[layerIndex];
            this.layerdiv.a([
                new e("div").pa().s("bc", cfg.LAYERLABEL_BCOL).s("cur", "ptr").r(layerIndex * cfg.NEURON_WIDTH + cfg.LAYERLABEL_MLEFT, cfg.LAYERLABEL_MTOP, cfg.LAYERLABEL_WIDTH, cfg.LAYERLABEL_HEIGHT).a([
                    new e("div").px("mg", cfg.LAYER_MARGIN).h(`Layer ${layerIndex + 1}`).
                        ae("mousedown", this.layerClicked.bind(this, layerIndex))
                ])
            ]);
            for (let neuronIndex = 0; neuronIndex < l.length; neuronIndex++) {
                let neuron = this.getNeuron(layerIndex, neuronIndex);
                let neuronCoords = this.nCoords(layerIndex, neuronIndex);
                let neuronDiv = new e("div").pa().r(neuronCoords.x, neuronCoords.y, cfg.NEURON_WIDTH, cfg.NEURON_HEIGHT).s("bc", cfg.NEURON_BCOL);
                let neuronColor = Misc.signedRgb((neuron.a - cfg.NEURON_SHIFT) * cfg.NEURON_COLOR_FACTOR);
                let neuronCircleDiv = new e("div").pa().s("cur", "ptr").s("bc", cfg.NEURON_BCOL).r(cfg.NEURON_MLEFT, cfg.NEURON_MTOP, cfg.NEURON_DIAMETER, cfg.NEURON_DIAMETER).h(Misc.circleSvg(cfg.NEURON_DIAMETER, neuronColor, neuronColor)).
                    ae("mousedown", this.neuronClicked.bind(this, layerIndex, neuronIndex));
                let biasVector = new Vectors.Vect(0, -cfg.NEURON_DIAMETER / 2).
                    r(Misc.normLin(neuron.bias, cfg.BIAS_NORMALIZATION) / cfg.BIAS_NORMALIZATION / 1.25);
                let neuronMiddle = new Vectors.ScreenVector(cfg.NEURON_DIAMETER / 2, cfg.NEURON_DIAMETER / 2);
                let biasVectorTo = neuronMiddle.Plus(new Vectors.ScreenVector(biasVector.x, biasVector.y));
                if (layerIndex > 0)
                    neuronCircleDiv.a([
                        DomUtils.createArrow(neuronMiddle.x, neuronMiddle.y, biasVectorTo.x, biasVectorTo.y, {
                            constantwidth: cfg.NEURON_DIAMETER / cfg.BIAS_WIDTH_FACTOR,
                            color: cfg.BIAS_ARROW_BCOL
                        })
                    ]);
                neuronDiv.a([
                    neuron.div = neuronCircleDiv
                ]);
                this.neurondiv.a([
                    neuronDiv
                ]);
            }
        }
    }
    buildCons(cfg) {
        this.iterateCons((fromLayerIndex, fromLayer, fromNeuronIndex, fromNeuron, toLayerIndex, toLayer, toNeuronIndex, toNeuron) => {
            let w = this.getWeight(fromLayerIndex, fromNeuronIndex, toLayerIndex, toNeuronIndex);
            if (w != undefined) {
                let ce = this.nmCoordsEmit(fromLayerIndex, fromNeuronIndex);
                let cr = this.nmCoordsReceive(toLayerIndex, toNeuronIndex);
                let col = Misc.signedRgb(w.w * cfg.WEIGHT_COLOR_FACTOR);
                let lw = Misc.normLinAbs(cfg.WEIGHT_ARROW_WIDTH * w.w, cfg.WEIGHT_ARROW_NORM) + 1;
                this.neurondiv.a([
                    DomUtils.createArrow(ce.x, ce.y, cr.x, cr.y, {
                        "constantwidth": lw,
                        "color": col
                    })
                ]);
            }
        });
    }
    copyWeights() {
        for (let index = 0; index < this.weights.length; index++) {
            let nwm = this.weights[index].data || this.weights[index]._data;
            for (let fromNeuronIndex = 0; fromNeuronIndex < this.config.layers[index].n; fromNeuronIndex++) {
                for (let toNeuronIndex = 0; toNeuronIndex < this.config.layers[index + 1].n; toNeuronIndex++) {
                    let nw = nwm[toNeuronIndex][fromNeuronIndex];
                    let w = new Weight(nw);
                    this.setWeight(index, fromNeuronIndex, index + 1, toNeuronIndex, w);
                }
            }
        }
    }
    copyBiases() {
        for (let index = 0; index < this.biases.length; index++) {
            let nbs = this.biases[index].data || this.biases[index]._data;
            for (let neuronIndex = 0; neuronIndex < nbs.length; neuronIndex++) {
                this.layers[index + 1].neurons[neuronIndex].bias = nbs[neuronIndex][0];
            }
        }
    }
    copyParameters() {
        this.copyWeights();
        this.copyBiases();
    }
    build() {
        let cfg = Globals.cfg.NeuralNet;
        this.cfg = cfg;
        this.copyParameters();
        this.buildDivs(cfg);
        this.buildNeurons(cfg);
        if (this.config.showWeights)
            this.buildCons(cfg);
        return this;
    }
    num_layers() { return this.sizes.length; }
    init() {
        this.sizes = this.config.layers.map(layer => layer.n);
        this.biases = this.sizes.slice(1).map(size => Misc.randn_matrix(size, 1));
        this.weights = [];
        for (let layerIndex = 1; layerIndex < this.num_layers(); layerIndex++) {
            let rm = Misc.randn_matrix(this.sizes[layerIndex], this.sizes[layerIndex - 1]);
            this.weights.push(rm);
        }
    }
    initClicked(e) {
        this.init();
        this.build();
    }
    backPropRand(verbose = false) {
        let x = this.randomInput();
        let y = this.logicOutput(x);
        this.backprop(x, y, verbose);
    }
    backPropBatch(n) {
        this.error_squared = null;
        for (let i = 0; i < n - 1; i++) {
            this.backPropRand();
        }
        this.backPropRand(true);
    }
    backPropClicked(n, e) {
        this.backPropBatch(n);
        this.build();
    }
    train(n) {
        if (n > 0) {
            let loaderI = this.trainloader.currentI;
            if (loaderI > 0) {
                this.setI = Math.floor(Math.random() * loaderI);
                Globals.neural = this.trainloader.neurals[this.setI];
            }
            this.backPropBatch(1000);
            this.epochIndex = n;
            this.build();
            n--;
            setTimeout(this.train.bind(this, n), 100);
        }
    }
    trainClicked(n, e) {
        this.train(n);
    }
    orderResults() {
        let y = this.activations[this.activations.length - 1]._data.slice();
        for (let i = 0; i < y.length; i++)
            y[i] = [i, y[i]];
        y.sort((a, b) => b[1] - a[1]);
        return y;
    }
    validate(vd) {
        let x = vd[0].map(a => [a]);
        this.feedforward(x);
        let y = this.orderResults();
        let correct_digit = vd[1];
        let actual_digit = y[0][0];
        this.validationInfo.n++;
        let ok = (actual_digit == correct_digit);
        if (ok)
            this.validationInfo.ok++;
        this.validationInfo.perf = `${(this.validationInfo.ok / this.validationInfo.n * 100).toLocaleString()} %`;
        this.validationInfo.c = correct_digit;
        this.validationInfo.y = y.map(item => [item[0], Math.floor(item[1] * 10)]);
    }
    validateBatch(vds) {
        for (let i = 0; i < vds.length - 1; i++) {
            this.validate(vds[i]);
        }
        this.validate(vds[Math.floor(Math.random() * vds.length)]);
    }
    validateClicked(max, e) {
        this.validationInfo.n = 0;
        this.validationInfo.ok = 0;
        for (let i = 0; i < Math.min(max, this.validationloader.currentI); i++) {
            this.validateBatch(this.validationloader.neurals[i]);
        }
        this.build();
    }
    ////////////////////////////
    // network   
    feedforward(x) {
        let activation = x;
        this.activations = [x];
        for (let index = 0; index < this.biases.length; index++) {
            let b = this.biases[index];
            let w = this.weights[index];
            let z = math.multiply(w, activation);
            z = math.add(z, b);
            activation = math.map(z, Misc.sigmoid);
            this.activations.push(activation);
        }
    }
    randomInput() {
        let set = Globals.neural;
        let index = Math.floor(Math.random() * set.length);
        this.randomIndex = index;
        return set[index][0].map(x => [x]);
    }
    logicOutput(x) {
        let set = Globals.neural;
        let out = set[this.randomIndex][1];
        this.logicout = out;
        return out.map(x => [x]);
    }
    cost_derivative(output_activations, y) {
        return math.subtract(output_activations, y);
    }
    backprop(x, y, verbose = false) {
        if (verbose) {
            console.log("------------------------");
            console.log("input", JSON.stringify(x));
            console.log("expected output", JSON.stringify(y));
        }
        let nabla_b = [];
        let nabla_w = [];
        // forward
        for (let index = 1; index < this.config.layers.length; index++) {
            let l = this.config.layers[index].n;
            let lPrev = this.config.layers[index - 1].n;
            nabla_b.push(math.matrix().resize([l, 1]));
            nabla_w.push(math.matrix().resize([lPrev, l]));
        }
        let activation = x;
        this.activations = [x];
        this.zs = [];
        for (let index = 0; index < this.biases.length; index++) {
            let b = this.biases[index];
            let w = this.weights[index];
            let z = math.multiply(w, activation);
            z = math.add(z, b);
            this.zs.push(z);
            activation = math.map(z, Misc.sigmoid);
            this.activations.push(activation);
        }
        let act_out = this.activations[this.activations.length - 1];
        let error = math.subtract(act_out, y);
        let error_T = math.transpose(error);
        let error_squared = math.multiply(error_T, error);
        if (this.error_squared == null)
            this.error_squared = error_squared;
        else
            this.error_squared = math.add(this.error_squared, error_squared);
        if (verbose) {
            console.log("actual output", JSON.stringify(act_out._data));
            console.log("error", JSON.stringify(error._data));
        }
        // backward
        let last_activation = this.activations[this.activations.length - 1];
        let last_z = this.zs[this.zs.length - 1];
        let last_z_sprime = math.map(last_z, Misc.sigmoid_prime);
        let cost_d = this.cost_derivative(last_activation, y);
        let delta = math.dotMultiply(cost_d, last_z_sprime);
        nabla_b[nabla_b.length - 1] = delta;
        let second_last_activation = this.activations[this.activations.length - 2];
        let second_last_activation_T = math.transpose(second_last_activation);
        nabla_w[nabla_w.length - 1] = math.multiply(delta, second_last_activation_T);
        for (let l = 2; l < this.num_layers(); l++) {
            let z = this.zs[this.zs.length - l];
            let sp = math.map(z, Misc.sigmoid_prime);
            let weight_l = this.weights[this.weights.length - l + 1];
            let weight_l_T = math.transpose(weight_l);
            let weight_l_times_delta = math.multiply(weight_l_T, delta);
            delta = math.dotMultiply(weight_l_times_delta, sp);
            nabla_b[nabla_b.length - l] = delta;
            let activations_l = this.activations[this.activations.length - 1 - l];
            let activations_l_T = math.transpose(activations_l);
            nabla_w[nabla_w.length - l] = math.multiply(delta, activations_l_T);
        }
        // update
        let eta = this.config.eta; // learning rate
        let lambda = this.config.lambda; // regularization
        for (let index = 0; index < this.weights.length; index++) {
            let nabla_w_eta = math.multiply(nabla_w[index], eta);
            let weight_reg = math.multiply(this.weights[index], (1 - lambda));
            this.weights[index] = math.subtract(weight_reg, nabla_w_eta);
            let nabla_b_eta = math.multiply(nabla_b[index], eta);
            this.biases[index] = math.subtract(this.biases[index], nabla_b_eta);
        }
    }
}
var Gui;
(function (Gui) {
    function startupError() {
    }
    function startupOk(callback) {
        Globals.cfg = Globals.guiconfigAsset.asJson();
        Globals.neural = Globals.neuralAsset.asJson();
        callback();
    }
    function startupThen(callback) {
        document.getElementById("scriptroot").appendChild(Globals.ld.e);
        Globals.guiconfigAsset = new TextAsset("guiconfig.json");
        Globals.neuralAsset = new TextAsset("assets/neural2/trd/trd.0.json");
        new AssetLoader().
            add(Globals.guiconfigAsset).
            add(Globals.neuralAsset).
            seterrorcallback(startupError).
            setcallback(startupOk.bind(this, callback)).
            load();
    }
    Gui.startupThen = startupThen;
})(Gui || (Gui = {}));
class App {
    build() {
        let nn = new NeuralNet("neuralnet", Globals.ld, 5).build();
        //nn.loadClicked(null)
        nn.tabs.selectByIndex(0);
        nn.trainloader = new TrainLoader("trd", 50).loadI();
        nn.validationloader = new TrainLoader("ted", 10).loadI();
        Globals.ld.root.h().a([
            new TabPane("maintabpane").setWidth(1200).setHeight(600).setTabs([
                new Tab("neuralnet", "NeuralNet", nn),
                new Tab("fch", "FileChooser", new FileChooser("fc", Globals.ld, 5).build()),
                new Tab("gitbr", "GitBrowser", new GitBrowser().build()),
                new Tab("rocket", "Rocket", new RocketCalculator().build()),
                new Tab("handdigit", "HandDigit", new GrayScale().fromData(Globals.neural[0]).build()),
                new Tab("log", "Log", this.logpane = new LogPane())
            ]).build()
        ]);
        return this;
    }
}
var Physics;
(function (Physics) {
    Physics.G = 6.674E-11;
    Physics.Me = 5.972E24;
    Physics.Re = 6.371E6;
    function Fg(m1, m2, r) {
        return Physics.G * m1 * m2 / (r * r);
    }
    Physics.Fg = Fg;
    function Fge(m, r) {
        return Physics.G * m * Physics.Me / (r * r);
    }
    Physics.Fge = Fge;
    class Vector {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        plus(v) {
            return new Vector(this.x + v.x, this.y + v.y);
        }
        minus(v) {
            return new Vector(this.x - v.x, this.y - v.y);
        }
        l() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        s(s) {
            return new Vector(this.x * s, this.y * s);
        }
    }
    Physics.Vector = Vector;
})(Physics || (Physics = {}));
class DrawCircle {
    constructor(x, y, r, fill, stroke) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.fill = fill;
        this.stroke = stroke;
    }
}
class RocketCalculator extends e {
    constructor() {
        super("div");
        this.m = 1000;
        this.x = 0;
        this.y = Physics.Re;
        this.vx = 605;
        this.vy = 7310;
        this.ts = 1;
        this.sts = 10;
        this.circles = [];
        this.simon = false;
        this.maxdist = 0;
        this.maxvabs = 0;
        this.GRAPH_WIDTH = 600;
        this.GRAPH_HEIGHT = 600;
        this.GRAPH_OFFSET_X = 200;
        this.GRAPH_OFFSET_Y = 300;
        this.SCALE_FACTOR = 1;
    }
    reset() {
        this.circles = [];
    }
    display() {
        this.mtext.setText("" + this.m);
        this.xtext.setText("" + this.x);
        this.ytext.setText("" + this.y);
        this.vxtext.setText("" + this.vx);
        this.vytext.setText("" + this.vy);
        this.tstext.setText("" + this.ts);
        this.ststext.setText("" + this.sts);
    }
    read() {
        this.m = parseFloat(this.mtext.getText());
        this.x = parseFloat(this.xtext.getText());
        this.y = parseFloat(this.ytext.getText());
        this.vx = parseFloat(this.vxtext.getText());
        this.vy = parseFloat(this.vytext.getText());
        this.ts = parseFloat(this.tstext.getText());
        this.sts = parseFloat(this.ststext.getText());
    }
    simulate() {
        this.simon = !this.simon;
        if (this.simon) {
            this.read();
            this.addCircle(0, 0, Physics.Re);
            this.drawsvg();
            this.stime = 0;
            this.maxdist = 0;
            this.maxvabs = 0;
            this.simulStep(null);
        }
    }
    GRAPH_SCALE() { return this.GRAPH_WIDTH / (4 * Physics.Re) * this.SCALE_FACTOR; }
    GRAPH_SCALE_X() { return this.GRAPH_SCALE(); }
    GRAPH_SCALE_Y() { return this.GRAPH_SCALE(); }
    x2sx(x) { return x * this.GRAPH_SCALE_X() + this.GRAPH_OFFSET_X; }
    y2sy(y) { return -y * this.GRAPH_SCALE_Y() + this.GRAPH_OFFSET_Y; }
    addCircle(x, y, r, fill = "#aaf", stroke = "#00f") {
        this.circles.push(new DrawCircle(x, y, r, fill, stroke));
    }
    circle(x, y, r, fill = "#aaf", stroke = "#00f") {
        this.svg.a([
            new e("circle").
                t("cx", "" + this.x2sx(x)).
                t("cy", "" + this.y2sy(y)).
                t("r", "" + r * this.GRAPH_SCALE()).
                t("fill", fill).
                t("stroke", stroke)
        ]);
    }
    drawsvg() {
        this.svg = new e("svg").
            t("width", "" + this.GRAPH_WIDTH).
            t("height", "" + this.GRAPH_HEIGHT);
        this.circles.map(dc => {
            this.circle(dc.x, dc.y, dc.r, dc.fill, dc.stroke);
        });
        this.svgdiv.h(`
        <svg width="${this.GRAPH_WIDTH}" height="${this.GRAPH_HEIGHT}">
            ${this.svg.e.innerHTML}
        </svg>
        `);
    }
    simulStep(ev) {
        let o = new Physics.Vector(this.x, this.y);
        if (o.l() < Physics.Re) {
            this.simon = false;
            return;
        }
        let v = new Physics.Vector(this.vx, this.vy);
        let l = o.l();
        let gfabs = -Physics.Fge(this.m, l);
        let gf = new Physics.Vector(o.x / l, o.y / l).s(gfabs);
        let a = gf.s(1 / this.m);
        let no = o.plus(v.s(this.ts));
        let nv = v.plus(a.s(this.ts));
        this.x = no.x;
        this.y = no.y;
        this.vx = nv.x;
        this.vy = nv.y;
        let dist = no.l() - Physics.Re;
        let vabs = nv.l();
        if (dist > this.maxdist)
            this.maxdist = dist;
        if (vabs > this.maxvabs)
            this.maxvabs = vabs;
        let travel = (Math.PI / 2 - Math.atan(no.y / no.x)) * Physics.Re;
        this.infodiv.h(`
<pre>
dist    :  ${(dist / 1000).toLocaleString()} km<br>
maxdist :  ${(this.maxdist / 1000).toLocaleString()} km<br>
vabs    :  ${vabs.toLocaleString()} m/s<br>
maxvabs :  ${this.maxvabs.toLocaleString()} m/s<br>
travel  :  ${(travel / 1000).toLocaleString()} km<br>            
time    :  ${this.stime} s<br>
</pre>
        `).px("w", 250).px("mg", 15);
        this.display();
        if (dist <= 0)
            this.simon = false;
        if (((this.stime % 50) == 0) || (!this.simon)) {
            this.addCircle(no.x, no.y, 150000, "#ff0", "#000");
            this.drawsvg();
        }
        this.stime += this.ts;
        if (this.simon) {
            this.simulbutton.e["value"] = "Stop simulation";
            setTimeout(this.simulStep.bind(this), this.sts);
        }
        else {
            this.simulbutton.e["value"] = "Simulate";
        }
    }
    build() {
        this.table = new e("table");
        this.mtext = new TextInput();
        this.xtext = new TextInput();
        this.ytext = new TextInput();
        this.vxtext = new TextInput();
        this.vytext = new TextInput();
        this.tstext = new TextInput();
        this.ststext = new TextInput();
        this.table.px("bs", 3).s("bcs", "separate").a([
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
                new e("td").t("colspan", "2").a([
                    new Button("+").
                        onClick(this.zoom.bind(this, 1.2)).
                        px("mg", 10),
                    new Button("-").
                        onClick(this.zoom.bind(this, 0.8)).
                        px("mg", 10),
                    this.simulbutton = new Button("Simulate").
                        onClick(this.simulate.bind(this)).
                        px("mg", 10)
                ])
            ])
        ]);
        this.h("").a([
            new e("table").px("bs", 5).s("bcs", "separate").px("mg", 5).
                s("ff", "ms").a([
                new e("tr").a([
                    new e("td").s("vertical-align", "top").a([
                        this.table,
                        this.infodiv = new e("div").s("ff", "ms")
                    ]),
                    new e("td").a([
                        this.svgdiv = new e("div").
                            z(this.GRAPH_WIDTH, this.GRAPH_HEIGHT)
                    ])
                ])
            ])
        ]);
        this.display();
        return this;
    }
    zoom(factor, e) {
        this.SCALE_FACTOR *= factor;
        this.drawsvg();
    }
}
function main() {
    Globals.app = new App().build();
    Globals.app.logpane.log(new Misc.Logitem("log").info());
}
//localStorage.clear()
Gui.startupThen(main);
