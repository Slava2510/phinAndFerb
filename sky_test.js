var imageCounter = 0 ;

function loadImage(url,parent,id) {
    var img = new Image() ;
    img.src = url ;
    img.onload = function() {
        parent.appendChild(img).setAttribute("id",id||"i"+imageCounter) ;
        imageCounter++ ;
    }
}
var parent = document.documentElement ;

loadImage("imgs/back.png",parent,"back");
loadImage("imgs/candace.png",parent,"candace") ;
loadImage("imgs/phineas.png",parent,"phineas") ;
loadImage("imgs/p_back.png",parent,"phineas2") ;
loadImage("imgs/ferb.png",parent,"ferb");
loadImage("imgs/ballon.png",parent,"ballon") ;
loadImage("imgs/b_full.png",parent,"ballon2") ;
loadImage("imgs/dialog_f.png",parent,"d1") ;
loadImage("imgs/dialog_fh.png",parent,"d2");
loadImage("imgs/corp.png",parent,"corp") ;
loadImage("imgs/doctor.png",parent,"doctor") ;
loadImage("imgs/perry_attak.png",parent,"perry") ;
loadImage("imgs/logo.png",parent,"logo") ;
loadImage("imgs/c_angry.png",parent,"angry") ;
    
for(var i=0 ; i<12 ; i++) {
    loadImage("imgs/cloud1.png",parent,"c"+i) ;
}

window.onload = function() {
    
    F.init() ;
    F.setStoryLength(200) ;

    var p1 = F(document.getElementById("phineas")).zIndex(10) ;
    var p2 = F(document.getElementById("phineas2")).zIndex(10).setOpacity(0) ;

    var b1 = F(document.getElementById("ballon")).zIndex(30) ;
    var b2 = F(document.getElementById("ballon2")).zIndex(30).setOpacity(0) ;
    
    var back = F(document.getElementById("back")).zIndex(-1) ;
    var cand = F(document.getElementById("candace")).zIndex(10) ;
    var phin = p1 ;
    var ferb = F(document.getElementById("ferb")).zIndex(10) ;
    var ballon = b1 ;
    var d1 = F(document.getElementById("d1"));
    var d2 = F(document.getElementById("d2")) ;
    var corp = F(document.getElementById("corp")).zIndex(20) ;
    var doctor = F(document.getElementById("doctor")).zIndex(30) ;
    var perry = F(document.getElementById("perry")).zIndex(10) ;
    var logo = F(document.getElementById("logo")).zIndex(100) ;
    var angry = F(document.getElementById("angry")).zIndex(100) ;

    var id = setInterval(function(){
        if(imageCounter==26) {
            clearInterval(id) ;
            go() ;
            document.getElementById("load").style.visibility = "hidden" ;
        }
    } , 100) ;
    
    function go() {
        F.fadeAll() ;
        d1.setOpacity(0).setWidth(20) ;
        d2.setOpacity(0).setWidth(20) ;
        logo.setWidth(0.5) ;
        back.setWidth(100).pos(50,back.h/2) ;
        phin.setWidth(12).pos(40,phin.h/2+3) ;
        ferb.setWidth(7).pos(5,ferb.h/2+3) ;
        cand.setWidth(10).pos(-cand.w/2,cand.h/2+3) ;
        ballon.setWidth(60).pos(90,ballon.h/2+5) ;
        corp.setWidth(50).pos(30,-corp.h/2) ;
        doctor.setWidth(8).pos(15,-corp.h/2-doctor.h/4*3-3) ;
        perry.setWidth(8).pos(40,doctor.y) ;
        angry.setWidth(20).pos(-angry.w/2,angry.h/2-2) ;
        
        var clouds = [] ;
        
        for(var i=0 ; i<12 ; i++) {
            clouds[i] = F(document.getElementById("c"+i)) ;
            clouds[i].pos(randPos()).setWidth(i*3) ;
            clouds[i].elem.style.zIndex = i*4 ;
        }
        
        F(1,5, function() {
            phin.move("left",2) ;
            ferb.move("right",2) ;
        }) ;
        F(7, function() {
            d1.pos(ferb.x+ferb.w/2+d1.w/5,ferb.y+ferb.h/2+d1.h/2) ;
            d1.fadeIn() ;
        }) ;
        F(11, function() {
            d1.fadeOut() ;
            d2.pos(phin.x+phin.w/2+d1.w/5,phin.y+phin.h/2+d1.h/2) ;
            d2.fadeIn() ;
        }) ;
        F(17, function() {
            d2.fadeOut() ;
            if(F.dir(true)) {
                phin.setOpacity(0) ;
                phin = p2.setHeight(phin.h).pos(phin.pos()).setOpacity(1) ;
            } else {
                phin.setOpacity(0) ;
                phin = p1.setHeight(phin.h).pos(phin.pos()).setOpacity(1) ;
            }
        }) ;
        F(18,33, function() {
            phin.move("right",4) ;
            ferb.move("right",4) ;
        }) ;
        F(34, function() {
            phin.fadeOut() ;
            ferb.fadeOut() ;
            if(F.dir(true)) {
                ballon.setOpacity(0) ;
                ballon = b2.setHeight(ballon.h).pos(ballon.pos()).setOpacity(1) ;
            } else {
                ballon.setOpacity(0) ;
                ballon = b1.setHeight(ballon.h).pos(ballon.pos()).setOpacity(1) ;
            }
        }) ;
        F(35,40, function() {
            cand.move("right",3) ;
        }) ;
        F(45, function() {
            cand.moveOut("left");
        }) ;
        F(46,55, function() {
            back.move("down",10) ;
        }) ;
        F(55,64, function() {
            ballon.move({x:-1,y:0},4) ;
        }) ;
        F(65,85, function() {
            for(var i=0 , len = clouds.length; i<len ; i++) {
                moveCloud(clouds[i],randPos()) ;
                clouds[i].move("down",7) ;
            }
        }) ;
        F(91,150, function() {
            for(var i=0 , len = clouds.length; i<len ; i++) {
                moveCloud(clouds[i],randPos()) ;
            }
        }) ;
        F(151,160, function() {
            for(var i=0 , len = clouds.length; i<len ; i++) {
                moveCloud(clouds[i],randPos()) ;
                clouds[i].move("up",8) ;
            }
            ballon.move("right",3) ;
            corp.move("up",corp.h/13) ;
            doctor.move("up",corp.h/13) ;
            perry.move("up",corp.h/13) ;
        }) ;
        F(161,171, function() {
            perry.move("left",2) ;
        }) ;
        F(172,function(){
            perry.moveOut("left") ;
            doctor.moveOut("left") ;
        }) ;
        F(173,182, function() {
            for(var i=0 , len = clouds.length; i<len ; i++) {
                moveCloud(clouds[i],randPos()) ;
                clouds[i].move("down",8) ;
            }
            corp.move("down",20) ;
        }) ;
        F(183,190,function(){
            for(var i=0 , len = clouds.length; i<len ; i++) {
                moveCloud(clouds[i],randPos()) ;
            }
            ballon.move({x:-1,y:-2},8) ;
        }) ;
        F(190,function(){
            if(F.dir(true)) {
                logo.pos(35,70) ;
            } else {
                logo.pos(-300,70) ;
            }
        }) ;
        F(190,199,function(){
            logo.resizeW(3) ;
            angry.move("right",3) ;
            if(!F.dir(true) && logo.w<4) {
                logo.fadeOut() ;
            }
        }) ;
        F(200,function(){
            for(var i=0 , len = clouds.length; i<len ; i++) {
                moveCloud(clouds[i],randPos()) ;
            }
        }) ;
    }

    function moveCloud(cloud,pos) {
        cloud.move("right",cloud.w/10) ;
        if(cloud.x > 150 && F.dir(true)) {
            cloud.pos(-50,cloud.y) ; 
        }
        if(cloud.x <-50 && !F.dir(true)) {
            cloud.pos(150,cloud.y) ; 
        }
    }

    function randPos() {
        return [Math.random()*100-10 , Math.random()*100+140] ;
    }
} ;

var resizeId ;
function resizeStopped() {
    FIX.refresh() ;
    document.getElementById("load").style.visibility = "hidden" ;
    clearTimeout(resizeId) ;
}

window.onresize = function(event) {
    document.getElementById("load").style.visibility = "visible" ;
    if(resizeId) clearTimeout(resizeId) ;
    resizeId  = setTimeout(resizeStopped,500) ;
};


