class Widget{
    onWidgetInit(){}
    onWidgetStartWork(){}
}

class Page{
    constructor(){
        this.widgets = [];
    }
    addWidget(widget){
        if(!(widget instanceof Widget)){
            throw new Error("Widget is not a Widget!")
        }
        this.widgets.push(widget);
    }

    start(){
        document.addEventListener("DOMContentLoaded",() => {
            this.widgets.forEach(widget=>{
                widget.onWidgetInit();
                widget.onWidgetStartWork();
            })
        });
    }
}