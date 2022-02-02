window.onload=function(){
var text_field=document.getElementById('text_field');
var search_btn=document.getElementById('search_btn');

  search_btn.addEventListener("mouseover",()=>{
    console.log("On");
    search_btn.style.backgroundColor="#0a76d5";
    text_field.style.borderColor="#0a76d5";
    search_btn.style.cursor="pointer";
  })
  search_btn.addEventListener("mouseout",()=>{
    search_btn.style.backgroundColor="#03387d";
    text_field.style.borderColor="#03387d";
  })

}
