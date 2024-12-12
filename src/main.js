const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const btnPlay = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const header = $('header h2')
const cdThumd  =$('.cd-thumb')
const audio = $('#audio')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const repeat =$('.btn-repeat')
const random = $('.btn-random')
const playList =$('.playlist')
const app ={
      currentIndex : 0,
      isPlay:false,
      isRandom:false,
      isRepeate:false,
      conFig:JSON.parse(localStorage.getItem('music-Quang-Linh')) ||{},

    songs: [
    {
      name: "nevada",
      singer: "Raftaar x Fortnite",
      path: './asset/music/sing1/sing1.mp4',
      image: "./asset/img/img1.jpg"
    },
    {
      name: "Đông Miên",
      singer: " A Nguyệt Nguyệt, Lưu Triệu Vũ",
      path: "./asset/music/sing2/sinh2.mp3",
      image:
      "./asset/img/img1.jpg"
    },
    {
      name: "Ngày Em Đẹp Nhất",
      singer: "TAMA",
      path:
        "./asset/music/sing3/sing3.mp3",
      image: "./asset/img/img1.jpg"
    },
    
    {
      name: "Kẻ Theo Đuổi Ánh Sáng",
      singer: "Huy Vạc x Tiến Nguyễn x Freak D",
      path:
        "./asset/music/sing5/sing5.mp3",
      image:
        "./asset/img/img1.jpg"
    },
    {
      name:"Nhu Anh Da Thay Em",
      singer: "PhucXp",
      path: "./asset/music/sing6/sing6.mp3",
      image:
        "./asset/img/img1.jpg"
    },
    {
      name: "Chờ Đợi Có Đáng Sợ",
      singer: "ANDIEZ",
      path: "./asset/music/sing7/sing7.mp3",
      image:
        "./asset/img/img1.jpg"
    }
  ],
  setConfig:function(key,value){
this.conFig[key] = value;
localStorage.setItem('music-Quang-Linh',JSON.stringify(this.conFig))
  },
  render:function(){
      const htmls = this.songs.map((song,index) =>{
        return `
        <div class="song ${index === this.currentIndex?'active':''}" data-index="${index}">
		<div class="thumb" style="background-image: url('${song.image}')">
		</div>
		<div class="body">
		  <h3 class="title">${song.name}</h3>
		  <p class="author">${song.singer}</p>
		</div>
		<div class="option">
		  <i class="fas fa-ellipsis-h"></i>
		</div>
	  </div>
        `
      })
      playList.innerHTML = htmls.join('')
  },
  defineProperties:function(){
    Object.defineProperty(this,'currentSong',{
      get: function(){
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvent:function(){
   const _this= this;
    const cd = $('.cd');
    const cdWith = cd.offsetWidth
    document.onscroll = function(){
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newWidth = cdWith - scrollTop

      cd.style.width = newWidth>0 ? newWidth + "px":0
      cd.style.opacity = newWidth / cdWith
    }
    
   const cdThumdAnimate =  cdThumd.animate([
    {transform:'rotate(360deg)'}
  ],{
    duration:10000,
    iterations: Infinity
  }
 
   
)
cdThumdAnimate.pause();
     
    btnPlay.onclick=function(){
     if( _this.isPlay){
      audio.pause()
     }
     else{
      audio.play()
     }

}
    audio.onplay=function(){
     _this.isPlay= true;
     player.classList.add('playing');
     cdThumdAnimate.play();
    }
    audio.onpause=function(){
     _this.isPlay = false;
     player.classList.remove('playing');
     cdThumdAnimate.pause();
   }
   audio.ontimeupdate = function(){
      if(audio.duration){
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
   }
    progress.onchange = function(e){
      const seek = e.target.value * audio.duration / 100
      audio.currentTime = seek
   }
    nextBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandom();
      }else{
        _this.nextSong();
        
      }
       audio.play();
       _this.render();
       _this.scrollToActiveSong();
    }
    prevBtn.onclick = function(){
      if(_this.isRandom){
        _this.playRandom();
      }else{
        _this.prevSong();
        
      }
    
     audio.play();
     _this.render();
     _this.scrollToActiveSong();
    }
    random.onclick = function(){
      _this.isRandom =!_this.isRandom;
      _this.setConfig('isRandom',_this.isRandom)
      random.classList.toggle('active',_this.isRandom)
      
    }
    audio.onended = function(){
      if(_this.isRepeate){
          audio.play();
      }else{

        nextBtn.click();
      }
    }
    repeat.onclick= function(){
      _this.isRepeate = !_this.isRepeate
      _this.setConfig('isRepeate', _this.isRepeate )
      repeat.classList.toggle('active',_this.isRepeate)
      
    }
    playList.onclick = function(e){
      const songNode =e.target.closest('.song:not(.active)');
       if(songNode || e.target.closest('.option') ){
            if(songNode){
             _this.currentIndex = Number(songNode.dataset.index)
             _this.loadCurentSong();
             audio.play();
             _this.render();x
            }
            if( e.target.closest('.option')){
            
            }
       }
    }
  },
  loadCurentSong:function(){
    header.textContent = this.currentSong.name
    cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
 },
 loadConfig:function(){
  this.isRandom = this.conFig.isRandom
  this.isRepeate = this.conFig.isRepeate
 },

 scrollToActiveSong:function(){
  setTimeout(()=>{
    $('.song.active').scrollIntoView({
      behavior:'smooth',
      block:'nearest',

    });
  },500)
 },
  nextSong: function(){
    this.currentIndex++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex=0
    }
     this.loadCurentSong();
    
  },
  prevSong: function(){
    this.currentIndex--
   if(this.currentIndex<0){
    this.currentIndex=this.songs.length - 1
  }
   this.loadCurentSong();
   
  },
  playRandom:function(){
    let newIndex
    do{newIndex = Math.floor(Math.random() * this.songs.length)}
    while(newIndex === this.currentIndex)
      this.currentIndex = newIndex
    this.loadCurentSong();
  },
  
  start:function(){
   this.loadConfig();
    this.defineProperties();
    this.render();
    this.loadCurentSong();
    this.handleEvent();
    repeat.classList.toggle('active',this.isRepeate)
    random.classList.toggle('active',this.isRandom)
  }

  
}
app.start();