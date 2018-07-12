function connectToJSON(callback){
    return fetch(location.protocol!=='file:'?'/static/data.json':"https://raw.githubusercontent.com/dimabendera/front-end-basics/master/static/data.json")
    .then(res => res.json())
    .then(callback)
    .catch(err => console.error(err)); 
};
// конструктор
class BooksList{
    constructor(){
        this._BooksList = document.querySelector("body > .content");
    }
    createBook(key, author, name, img, isRight){
        return '<div class="item" id="'+key+'"><div class="pic"><span><img src="'+img+'"></span></div><div class="title"><span><b>Название:</b> "'+name+'"</span><span><b>Автор:</b> '+author+'</span></div><div class="'+(isRight?"before":"after")+'"></div></div>';
    };
    async loadBooks(){
        if(!localStorage.length){
            await connectToJSON((res)=>{
                for(let key in res){
                    res[key].isRight=0;
                    this._BooksList.querySelector(".left")
                    .insertAdjacentHTML("beforeEnd", this.createBook("item"+key, res[key].author, res[key].name, res[key].img, 0));
                }
            });
        }else{ 
            this._BooksList.querySelector(".left").innerHTML=localStorage.getItem("left");
            this._BooksList.querySelector(".right").innerHTML=localStorage.getItem("right");
        }
        this.giveOnClickEvents();
    };
    saveToLocalStorage(){
        localStorage.setItem("left", this._BooksList.querySelector(".left").innerHTML);
        localStorage.setItem("right", this._BooksList.querySelector(".right").innerHTML);
    };
    giveOnClickEvents(){
        let root = this;
        function goRight(ev){
            ev.currentTarget.onclick = goLeft;
            ev.currentTarget.className = "before";
            root._BooksList.querySelector(".right").appendChild(ev.currentTarget.parentNode);
            root.saveToLocalStorage();
        };
        function goLeft(ev){
            ev.currentTarget.onclick = goRight;
            ev.currentTarget.className = "after";
            root._BooksList.querySelector(".left").appendChild(ev.currentTarget.parentNode);
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
    list.loadBooks();
    //BooksList.goRight(1);
}
