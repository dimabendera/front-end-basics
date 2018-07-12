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
    }
    createHTMLBook(key, author, name, img, isRight){
        return '<div class="item" id="'+key+'"><div class="pic"><span><img src="'+img+'"></span></div><div class="title"><span><b>Название:</b> "'+name+'"</span><span><b>Автор:</b> '+author+'</span></div><div class="'+(isRight?"before":"after")+'"></div></div>';
    };
    loadHTML(regFilter){
        for(let key in this._Books){
            if(regFilter instanceof RegExp){
                if(!regFilter.test(this._Books[key].author)){
                    continue;
                }
            }
            if(this._Books[key].isRight){
                this._BooksHTML.querySelector(".right").insertAdjacentHTML("beforeEnd", this.createHTMLBook(key, this._Books[key].author, this._Books[key].name, this._Books[key].img, 1));
            }else{
                this._BooksHTML.querySelector(".left").insertAdjacentHTML("beforeEnd", this.createHTMLBook(key, this._Books[key].author, this._Books[key].name, this._Books[key].img, 0));
            }
        }
        this.initOnClickEvents();
    };
    saveToLocalStorage(){
        localStorage.setItem("books", JSON.stringify(this._Books));
    };
    initOnClickEvents(){
        let root = this;
        function goRight(ev){
            ev.currentTarget.onclick = goLeft;
            ev.currentTarget.className = "before";
            root._Books[ev.currentTarget.parentNode.getAttribute('id')].isRight=1;
            root._BooksHTML.querySelector(".right").appendChild(ev.currentTarget.parentNode);
            root.saveToLocalStorage();
        };
        function goLeft(ev){
            ev.currentTarget.onclick = goRight;
            ev.currentTarget.className = "after";
            root._Books[ev.currentTarget.parentNode.getAttribute('id')].isRight=0;
            root._BooksHTML.querySelector(".left").appendChild(ev.currentTarget.parentNode);
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
};
window.onload = ()=>{ 
    let list = new BooksList();
    list.init();
    list.loadHTML();
}
