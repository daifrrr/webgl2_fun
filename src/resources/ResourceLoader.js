/* ResourceLoader.setup(gl,onReady).loadTexture(<name>,"path/to/resource.jpg").start(); */
export default class ResourceLoader {

    static setup(gl,completeHandler){
        ResourceLoader.gl = gl;
        ResourceLoader.onComplete = completeHandler;
        return this;
    }

    static start() {
        if(ResourceLoader.Queue.length > 0) ResourceLoader.loadNextItem();
    }

    static loadTexture(name, src) {
        console.log(name, src);
        for(let i = 0; i < arguments.length; i+=2) {
            ResourceLoader.Queue.push({type:"img",name:arguments[i],src:arguments[i+1]});
        }
        return this;
    }

    static loadNextItem() {
        if(ResourceLoader.Queue.length === 0) {
            if(ResourceLoader.onComplete !== null) {
                ResourceLoader.onComplete();
            } else {
                console.log("Resources are loaded successfully");
            }
            return;
        }

        let item = ResourceLoader.Queue.pop();
        switch(item.type) {
            case "img":
                let img = new Image();
                img.queueData = item;
                img.load = ResourceLoader.onDownloadSuccess;
                img.abort = img.onerror = ResourceLoader.onDownloadError;
                img.src = item.src;
                break;
        }
    }

    static onDownloadSuccess() {
        if(this instanceof Image) {
            let data = this.queueData;
            console.log(this.queueData);
            ResourceLoader.gl.fLoadTexture(data.name,this);
        }
        ResourceLoader.loadNextItem();
    }

    static onDownloadError() {
        console.error("Error getting " +  this);
        ResourceLoader.loadNextItem();
    }

}

ResourceLoader.Queue = [];
ResourceLoader.onComplete = null;
ResourceLoader.gl = null;