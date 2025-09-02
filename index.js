  let previous = document.getElementById("previous");
  let next = document.getElementById("next")
  let play = document.getElementById("play")
  let seekbar = document.querySelector(".seekbar")
  let songs = [];







//function which convert secnds to minuts----------------

function secondsToMinutes(seconds) {
  // Ensure seconds is a number (handle NaN cases)
  const sec = Math.floor(Number(seconds)) || 0;

  // Calculate minutes and remaining seconds
  const mins = Math.floor(sec / 60);
  const remainingSecs = sec % 60;

  // Pad with leading zeros (e.g., 5 becomes "05")
  const paddedMins = String(mins).padStart(2, '0');
  const paddedSecs = String(remainingSecs).padStart(2, '0');

  // Return formatted string (MM:SS)
  return `${paddedMins}:${paddedSecs}`;
}



// async function gatSongs(folder) {
//     let a = await fetch(`/music/${folder}`)

//     let response = await a.text()
    
//     let div = document.createElement("div");
//     div.innerHTML = response;
//     let as = div.getElementsByTagName("a")
//     let songs = [];
//     for(let index = 0; index < as.length; index++){
//         let element = as[index];
       
//         if(element.href.endsWith(".mp3")){
//             songs.push(element.href)
//         }
//     }
//    return songs;
// }


async function gatSongs(folder) {
  let res = await fetch("./songs.json");
  let data = await res.json();

  if (!data[folder]) {
    console.error("Folder not found in songs.json:", folder);
    return [];
  }

  return data[folder].map(filename => `music/${folder}/${filename}`);
}



let currentSong = new Audio()


let playMusic = (track, pause=false)=>{
    // let audio = new Audio( track)
    currentSong.src = track
    if(!pause){
      currentSong.play();
      play.innerHTML = '<i class="fa-solid fa-pause"></i>'
    }
    

    

  document.querySelector(".songTime").innerHTML = ' ';
  document.querySelector(".songInfo").innerHTML = '00:00 / 00:00'; 
   
    
}

async function main() {

  
    

  
  play.addEventListener('click', ()=>{
   



    if(currentSong.paused){
        currentSong.play()
        play.innerHTML = '<i class="fa-solid fa-pause"></i>'
    }
    else{currentSong.pause();
        play.innerHTML = '<i  class="fa-solid fa-play"></i>'
    }
  })

      currentSong.addEventListener("timeupdate", ()=>{
      // document.querySelector(".songTime").innerHTML =track;
    document.querySelector(".songInfo").innerHTML = `${secondsToMinutes(currentSong.currentTime)} / ${secondsToMinutes(currentSong.duration)}`;
    document.querySelector(".circle").style.left =((currentSong.currentTime)/(currentSong.duration))*100 + "%";
    })
  // currentSong.addEventListener("timeupdate", ()=>{
  //   console.log(currentSong.currentTime, currentSong.duration)
  // })


  seekbar.addEventListener("click",(e)=>{
    let percent = (e.offsetX / e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left = percent +"%";
  currentSong.currentTime = ((currentSong.duration)*percent)/100
  })



previous.addEventListener("click",()=>{
  console.log("clicked next");
const currentIndex = songs.findIndex(song => song.includes(currentSong.src.split('/').pop()));

if(currentIndex-1 >= 0){
  playMusic(songs[currentIndex - 1])
}else{console.log("you are at first song")}
})
  


next.addEventListener("click",()=>{
console.log("clicked next");
const currentIndex = songs.findIndex(song => song.includes(currentSong.src.split('/').pop()));

  if(currentIndex +1 < songs.length){

playMusic(songs[currentIndex + 1])
    console.log("currentindex",currentIndex)
console.log("next solg played")
  }else{console.log("you are at last song")}


})
 


document.getElementById('volumeControl').addEventListener("input", () => {
  currentSong.volume = parseFloat(volumeControl.value);
})

let cards = document.querySelectorAll(".card");

cards.forEach(card => {
  card.addEventListener("click", async (e) => {
    console.log("hellow card is clicked");
    

    if(window.innerWidth < 900){
      document.querySelector(".left").style.display = "block"
    }
   
    let folderOfSong = e.currentTarget.dataset.folder;
    console.log(folderOfSong);
     songs = await gatSongs(folderOfSong);
    playMusic(songs[0],true);

    // console.log(songs);

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ''; 
   
    for ( let song of songs ){
        songUL.innerHTML = songUL.innerHTML + `<li>
        
        
                        <i class="fa-solid fa-music"></i>
                        <div class="info">
                            <div class = 'songName'>${song}</div>
                        <div>Ankit</div>
                        </div>
                       
                    

        </li>`;
    }

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=> {
    e.addEventListener('click', ()=>{
        console.log(e.querySelector(".songName").innerHTML)

        playMusic(e.querySelector(".songName").innerHTML.trim())

    })
  })  

  });
});



let more = document.querySelector(".more");
more.addEventListener("click",()=>{
  console.log("more is clicked")
  document.querySelector(".left").style.display = "block";
})

let close = document.querySelector(".close");
close.addEventListener('click', ()=>{
  console.log("cancle is clicked");
  document.querySelector(".left").style.display = "none";
})


}

main();
