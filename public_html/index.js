/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var dataReload=document.querySelectorAll("[data-reload]")
//translation
var language={
    eng:{
        free:"Free-editing app"
    },
    es:{
        free:"Aplicación de edición gratuita"
    }
};

//detects language
if(window.location.hash)
{
    if(window.location.hash==="#es")
    {
//       hi= document.getElementById('hi');
        hi.textContent=language.es.free;
    }
}

//detect language reload onclick
//var dataReload=document.querySelectorAll("[data-reload]");
for(i=0;i<=dataReload.length;i++)
{
    dataReload[i].onclick=function()
    {
        location.reload(true);
    }
}

    
