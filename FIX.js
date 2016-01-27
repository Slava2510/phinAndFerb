(function(){
    var FIX = window.FIX = window.F = function() {
        if(arguments.length == 3) {
            FIX.between(arguments[0],arguments[1],arguments[2]) ;
            return ;
        }
        if(arguments.length==2) {
            FIX.between(arguments[0],arguments[0],arguments[1]) ;
            return ;
        }
        var e ;
        var param = arguments[0] ;
        if(!elemBuffer.empty()) {
            e = elemBuffer.find(param) ;
            if(e != false) return e ;
        }
        e = new DOMElem(param) ;
        elemBuffer.add(e) ;
        return e ;
    } ;

    FIX.handler = function(){} ;
    FIX.between = function(start , end , callback) {
        core.listeners.push({
            "start":start ,
            "end":end ,
            "callback":callback
        }) ;
    } ;
    FIX.init = function() {
        core.init() ;
    } ;
    FIX.dir = function(param) {
        return param ? core.delta>0 : core.delta ;
    } ;
    FIX.step = function() {
       return core.stepCounter ;
    } ;
    FIX.setStoryLength = function(length) {
        core.storyLength = length ;
    } ;
    FIX.fadeAll = function() {
        for(var i=0 ; i<elemBuffer.buffer.length ; i++) {
            var e = elemBuffer.buffer[i] ;
            e.pos(-e.w , -e.h) ;
        }
    } ;
    FIX.refresh = function() {
        var elem ;
        for (var i=0 ; i<elemBuffer.buffer.length ; i++) {
            elem = elemBuffer.buffer[i] ;
            elem.setSize(elem.w,elem.h).pos(elem.pos()) ;
        }
    } ;

    function DOMElem(elem) {
        this.elem = elem ;
        var size = tools.getSize(elem) ;
        this.w = size[0] ;
        this.h = size[1] ;
        var pos = tools.getPos(elem) ;
        this.x = pos[0] + size[0]/2 ;
        this.y = pos[1] - size[1]/2 ;
        this.opacity = parseInt(tools.getCompStyle(elem)["opacity"]) ;
        this.swing = false ;
    }

    DOMElem.prototype = {
        move : function(direction , delta) {
            switch (direction) {
                case "left" :{
                    direction = {x:-1,y:0} ;
                    break ;
                }
                case "right" :{
                    direction = {x:1,y:0} ;
                    break ;
                }
                case "up" : {
                    direction = {x:0,y:1} ;
                    break ;
                }
                case "down" : {
                    direction = {x:0,y:-1} ;
                    break ;
                }
            }
            var elem = this.elem ;
            var vec = tools.normVec(direction) ;
            var scrlDir = core.delta ;
            timer.addFunc(function() {
                this.x += vec.x*scrlDir ;
                this.y += vec.y*scrlDir ;
                var newPos = tools.fromNewCoord(this.x-this.w/2 ,this.y+this.h/2) ;
                elem.style.top = newPos[1] + "px" ;
                elem.style.left = newPos[0] + "px" ;
                delta-- ;
                return delta>0 ;
            },this) ;
            timer.start() ;
            return this ;
        } ,
        moveTo : function(x,y,speed) {
            if(arguments.length == 1) {
                y = x[1] ;
                x = x[0] ;
            }
            var delta_x = x-this.x ;
            var delta_y = y-this.y ;
            var delta = Math.sqrt(delta_x*delta_x+delta_y*delta_y) ;
            this.move({x:delta_x,y:delta_y},delta/2).move({x:delta_x,y:delta_y},delta/2) ;
            return this ;
        } ,
        pos : function(x, y) {
            if(arguments.length == 0) return [this.x,this.y] ;
            if(arguments.length == 1) {
                y = x[1] ;
                x = x[0] ;
            }
            this.x = x ;
            this.y = y ;
            var coord = tools.fromNewCoord(x-this.w/2 ,y+this.h/2) ;
            this.elem.style.left = coord[0] + "px" ;
            this.elem.style.top = coord[1] + "px";
            //console.log(coord[1]) ;
            return this ;
        } ,
        fade : function(delta) {
            var steps = 5 ;
            var dir = core.delta ;
            var newVal = this.opacity+delta*dir ;
            if(newVal<0) delta = -dir*this.opacity ;
            if(newVal>1) delta = dir*(1-this.opacity) ;
            timer.addFunc(function() {
                this.opacity += dir*(delta/5) ;
                this.elem.style.opacity = this.opacity ;
                steps-- ;

                return steps>0 ;
            } , this) ;
            timer.start() ;
            return this ;
        } ,
        setOpacity : function(op) {
            this.opacity = op ;
            this.elem.style.opacity = op ;
            return this ;
        } ,
        setWidth : function(w , saveProps) {
            if(saveProps!==false) {
                var prop = this.w/this.h ;
                var h = w/prop ;
                this.setSize(w,h) ;
            } else {
                this.setSize(w,this.h) ;
            }
            return this ;
        } ,
        setHeight : function(h , saveProps) {
            if(saveProps!==false) {
                var prop = this.w/this.h ;
                var w = h*prop ;
                this.setSize(w,h) ;
            } else {
                this.setSize(this.w,h) ;
            }
            return this ;
        } ,
        setSize : function(w , h) {
            this.w = w ;
            this.h = h ;
            var size = tools.sizeFromNewCoord(w,h) ;
            this.elem.style.width = size[0] + "px" ;
            this.elem.style.height = size[1] + "px" ;
            return this ;
        } ,
        resizeH : function(delta_h , saveProps) {
            if(saveProps!==false) {
                var prop = this.w/this.h ;
                var w = delta_h*prop ;
                this.resize(w,delta_h) ;
            } else {
                this.resize(0,delta_h) ;
            }
            return this ;
        },
        resizeW : function(delta_w , saveProps) {
            if(saveProps!==false) {
                var prop = this.w/this.h ;
                var h = delta_w/prop ;
                this.resize(delta_w,h) ;
            } else {
                this.resize(delta_w,0) ;
            }
            return this ;
        } ,
        resize : function(delta_w , delta_h) {
            /*this.x -= delta_w/2 ;
            this.y += delta_h/2 ;*/
            var steps = Math.sqrt(delta_w*delta_w+delta_h*delta_h) ;
            delta_w = delta_w/steps ;
            delta_h = delta_h/steps ;
            var dir = core.delta ;
            timer.addFunc(function() {
                this.w += delta_w*dir ;
                this.h += delta_h*dir ;
                var size = tools.sizeFromNewCoord(this.w,this.h) ;
                this.elem.style.width = size[0] + "px" ;
                this.elem.style.height = size[1] + "px" ;
                steps-- ;
                return steps>0 ;
            },this) ;
            timer.start() ;
            return this ;
        } ,
        moveOut : function(direction) {
            return this.move(direction,50).move(direction,50) ;
        } ,
        fadeIn : function() {
            return this.fade(1) ;
        } ,
        fadeOut : function() {
            return this.fade(-1) ;
        } ,
        zIndex : function(val) {
            this.elem.style.zIndex = val ;
            return this ;
        }
    } ;

    var elemBuffer = {
        buffer : [] ,
        add : function(obj) {
            this.buffer.push(obj) ;
        } ,
        find : function(elem) {
            for (var i=0 ; i<this.buffer.length ; i++) {
                if(this.buffer[i].elem===elem) return this.buffer[i] ;
            }
            return false ;
        } ,
        empty : function() {
            return !(this.buffer.length > 0) ;
        }
    } ;

    var core = {
        storyLength : 100 ,
        delta : 1 ,
        stepCounter : 0,
        listeners : [] ,
        touchPos : 0 ,
        incrStep : function(delta) {
            var newVal = this.stepCounter + delta ;
            if(newVal >= 0 && newVal <= this.storyLength) {
                this.stepCounter = newVal ;
            }
        } ,
        callQueue : {
            id: 0 ,
            delay : 0 ,
            size : 1 ,
            queue : [] ,
            add : function(fn) {
                if(this.queue.length<=this.size) this.queue.push(fn) ;
                this.execute() ;
            } ,
            execute : function() {
                var Queue = this ;
                function next(){
                    Queue.id = setTimeout(next,Queue.delay) ;
                    if(Queue.queue.length != 0) {
                        Queue.queue.shift()() ;
                    } else {
                        clearTimeout(Queue.id) ;
                        return ;
                    }
                    Queue.id = setTimeout(next,Queue.delay) ;
                }
                Queue.id = setTimeout(next,Queue.delay) ;
            }
        },
        handler : function(event , d) {
            core.callQueue.add(function () {
                var delta ;
                if(event) {
                    if (event.wheelDelta) {
                        delta = event.wheelDelta;
                    } else if (event.detail) {
                        delta = event.detail;
                    }
                    if (navigator.userAgent.indexOf('Firefox') == -1) {
                        delta = -1 * delta;
                    }
                    delta = delta / Math.abs(delta);
                } else {
                    delta = d ;
                }
                core.delta = delta;
                event.preventDefault ? event.preventDefault() : (event.returnValue = false);

                if(delta>0) core.incrStep(delta) ;

                FIX.handler(core.stepCounter,delta) ;

                var left ;
                var right ;
                for (var i=0 ; i<core.listeners.length ; i++) {
                    left = core.listeners[i].start ;
                    right = core.listeners[i].end ;
                    if (core.stepCounter>=left && core.stepCounter<=right) {
                        core.listeners[i].callback(core.stepCounter-left+1) ;
                    }
                }
                if(delta<0) core.incrStep(delta) ;
            }) ;
        } ,
        init : function() {
            if(document.addEventListener) {
                document.addEventListener('DOMMouseScroll',this.handler,false);
                document.addEventListener("mousewheel",this.handler,false) ;
                document.addEventListener("keydown",handleKeyPress,false) ;
                document.addEventListener("touchmove",touchScreenMove,false) ;
                document.addEventListener("touchstart",function(e){
                    core.touchPos = e.touches[0].pageY ;
                    if(!core.touchCounter) {
                        core.touchCounter = 0 ;
                    }
                },false) ;
            } else if (document.attachEvent) {
                document.attachEvent('onmousewheel',this.handler);
                document.attachEvent("onkeydown",handleKeyPress) ;
            }
            function handleKeyPress(e) {
                if(e.keyCode==40) {
                    core.handler(false,1) ;
                }
                if(e.keyCode==38) {
                    core.handler(false,-1) ;
                }
            }
            function touchScreenMove(e) {
                e.preventDefault() ;
                core.touchCounter++ ;
                if(core.touchCounter%5 == 1) {
                    var tmp = core.touchPos-e.touches[0].pageY;
                    if(tmp>0) {
                        core.handler(false,1) ;
                    }
                    if (tmp<0) {
                        core.handler(false,-1) ;
                    }
                }
                
            }
        }
    } ;

    var tools = {
        getCompStyle : function(elem) {
            return window.getComputedStyle ? getComputedStyle(elem, "") : elem.currentStyle;
        } ,
        getClientWidth : function() {
            return document.documentElement.clientWidth || document.body.clientWidth;
        } ,
        getClientHeight : function() {
            return document.documentElement.clientHeight || document.body.clientHeight;
        } ,
        toNewCoord : function(left,top) {
            return[left*(100/tools.getClientWidth()), 100-top*(100/tools.getClientHeight())] ;
        } ,
        fromNewCoord : function(x,y) {
            var height = tools.getClientHeight() ;
            return [x*(tools.getClientWidth()/100),height-y*(height/100)] ;
        } ,
        sizeToNewCoord : function(w,h) {
            return [w*100/tools.getClientWidth() , h*100/tools.getClientHeight()] ;
        } ,
        sizeFromNewCoord : function(w,h) {
            return [w*tools.getClientWidth()/100 , h*tools.getClientHeight()/100] ;
        } ,
        getPos : function (elem) {
            var compStyle = tools.getCompStyle(elem) ;
            return tools.toNewCoord(parseInt(compStyle["left"]),parseInt(compStyle["top"])) ;
        } ,
        getSize : function(elem) {
            var compStyle = tools.getCompStyle(elem) ;
            return tools.sizeToNewCoord(parseInt(compStyle["width"]),parseInt(compStyle["height"])) ;
        },
        normVec : function(vec) {
            var norm = Math.sqrt(vec.x*vec.x+vec.y*vec.y) ;
            return {
                x: vec.x / norm ,
                y: vec.y / norm
            };
        }

    } ;

    var timer = {
        id : 0 ,
        delay : 10 ,
        addFunc : function (fn,obj) {
            obj = obj || window ;
            this.funcs.push({
                fn : fn ,
                obj : obj
            }) ;
        } ,
        funcs : [] ,
        start : function() {
            if(!timer.id) {
                (function next(){
                    if(timer.funcs.length>0) {
                        for (var i = 0; i < timer.funcs.length; i++) {
                            if (timer.funcs[i].fn.call(timer.funcs[i].obj) === false) {
                                timer.funcs.splice(i, 1);
                                i--;
                            }
                        }
                        timer.id = setTimeout(next,timer.delay) ;
                    } else {
                        clearTimeout(timer.id) ;
                        timer.id = 0 ;
                    }

                })() ;
            }
        }
    } ;

})() ;
