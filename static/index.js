function connectToJSON(callback){
    return fetch(location.protocol!=='file:'?'/static/data.json':"https://raw.githubusercontent.com/dimabendera/front-end-basics/master/static/data.json")
    .then(res => res.json())
    .then(callback)
    .catch(err => console.error(err)); 
};
// конструктор
class BooksList{
    constructor(){
        this._BooksHTML = document.querySelector("body > .content");
        this._Books = {};
    }
    async init(){
        if(!localStorage.getItem("books")){
            await connectToJSON((res)=>{
                this._Books = res;
            });
        }else{ 
            let books = JSON.parse(localStorage.getItem("books"));
            this._Books=(books===null)?{}:books;
        }
        this.initOnInputEvents();
    }
    createHTMLBook(key, author, name, img, isRight){
        return '<div class="item" id="'+key+'"><div class="pic"><span><img src="'+img+'"></span></div><div class="title"><span><b>Название:</b> "'+name+'"</span><span><b>Автор:</b> '+author+'</span></div><div class="'+(isRight?"before":"after")+'"></div></div>';
    };
    clearHTML(){
        this._BooksHTML.querySelector(".left").innerHTML="";
        this._BooksHTML.querySelector(".right").innerHTML="";
    }
    loadHTML(regFilter){
        this.clearHTML();
        this.initCounters();
        for(let key in this._Books){
            if(regFilter instanceof RegExp){
                if(!regFilter.test(this._Books[key].author)){
                    continue;
                }
            }
            if(this._Books[key].isRight){
                this._BooksHTML.querySelector(".block>.countRight").innerHTML++;
                this._BooksHTML.querySelector(".right").insertAdjacentHTML("beforeEnd", this.createHTMLBook(key, this._Books[key].author, this._Books[key].name, this._Books[key].img, 1));
            }else{
                this._BooksHTML.querySelector(".block>.countLeft").innerHTML++;
                this._BooksHTML.querySelector(".left").insertAdjacentHTML("beforeEnd", this.createHTMLBook(key, this._Books[key].author, this._Books[key].name, this._Books[key].img, 0));
            }
        }
        this.initOnClickEvents();
    };
    saveToLocalStorage(){
        localStorage.setItem("books", JSON.stringify(this._Books));
    };
    initOnInputEvents(){
        this._BooksHTML.querySelector("div>input").oninput = () => {
            this.loadHTML(new RegExp(".+"+this._BooksHTML.querySelector("div>input").value+".+", "i"));
        };
    };
    initOnClickEvents(){
        let root = this;
        function goRight(ev){
            ev.currentTarget.onclick = goLeft;
            ev.currentTarget.className = "before";
            root._Books[ev.currentTarget.parentNode.getAttribute('id')].isRight=1;
            root._BooksHTML.querySelector(".right").appendChild(ev.currentTarget.parentNode);
            root._BooksHTML.querySelector(".block>.countRight").innerHTML++;
            root._BooksHTML.querySelector(".block>.countLeft").innerHTML--;
            root.saveToLocalStorage();
        };
        function goLeft(ev){
            ev.currentTarget.onclick = goRight;
            ev.currentTarget.className = "after";
            root._Books[ev.currentTarget.parentNode.getAttribute('id')].isRight=0;
            root._BooksHTML.querySelector(".left").appendChild(ev.currentTarget.parentNode);
            root._BooksHTML.querySelector(".block>.countRight").innerHTML--;
            root._BooksHTML.querySelector(".block>.countLeft").innerHTML++;
            root.saveToLocalStorage();
        };
        let elems = document.querySelectorAll('div.item>div.after');
        for(let i=0;i<elems.length;i++){
            elems[i].onclick = goRight;
        }
        elems = document.querySelectorAll('div.item>div.before');
        for(let i=0;i<elems.length;i++){
            elems[i].onclick = goLeft;
        }
    };
    initCounters(){
        this._BooksHTML.querySelector(".block>.countLeft").innerHTML=0;
        this._BooksHTML.querySelector(".block> .countRight").innerHTML=0;
    };
};
window.onload = ()=>{ 
    try{
        let list = new BooksList();
        list.init();
        list.loadHTML();
    }catch(err){
        console.error(err);
    }
}
