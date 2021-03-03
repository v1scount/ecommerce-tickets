import React,{useState, useEffect} from 'react'
import './musicBar.css'

const audio = new Audio('https://raw.githubusercontent.com/JackZeled0n/MDB-Help/master/MDB-Help/snippets/music/lifestream.mp3')

const MusicBar = () =>{
    const [isPlaying, setIsPlaying] = useState(false)
    const [volume, setVolumne] = useState(0.5)
  
  
    useEffect(()=> {
        audio.addEventListener('ended', () =>setIsPlaying(false));
        return () => {
            audio.removeEventListener('ended', () =>setIsPlaying(false));  
        }
    },[])


    const togglePlay = () => {
        if(isPlaying){
            audio.pause()
            setIsPlaying(false)
        }else{
            audio.play()
            setIsPlaying(true)    
        }
    }

    const inscreaseVolumen = () =>{
        if(volume + 0.1 > 1) return
        setVolumne(vol => vol + 0.1)
        audio.volume = volume
    }
    const decreaseVolumen = () => {
        if(volume - 0.1 < 0) return

        setVolumne(vol => vol - 0.1)
        audio.volume = volume
    }


    return <div classNameName="musicbar-container">
        <div className="view">

      <div className="mask rgba-black-strong flex-center flex-column">

        <div className="row justify-content-center ">


          <div className="card-wow-fadeInDown" data-wow-delay="0.6s" style={{width: '30%'}}>

 
            <div className="view overlay">
              <img className="card-img-top" src="https://raw.githubusercontent.com/JackZeled0n/MDB-Help/master/MDB-Help/snippets/img/music.jpg" alt="Card image cap"/>
              <a href="#!">
                <div className="mask rgba-white-slight"></div>
              </a>
            </div>


            <div className="card-body" id="player-card">

  
              <h4 className="card-title font-weight-bold"><a>MusicBar</a></h4>


              <ul className="list-unstyled list-inline player-controls">
                <span id="seek-obj-container">
                  <progress id="seek-obj" value="0" max="1"></progress>
                </span>
              </ul>


              <p className="mb-2">Dream Machine</p>
              {Math.round(volume*10)}

              <div className="d-flex justify-content-between">
                <p className="card-text" id="music-current">
                  0:00
                </p>
                <p className="card-text" id="music-duration">
                  0:00
                </p>
              </div>

              <hr className="my-4"/>
              <ul className="list-unstyled list-inline d-flex justify-content-center mb-0">

                <li className="list-inline-item mr-0 mt-2">
                  <i className="fas fa-volume-down fa-2x" id="down" onClick={() => decreaseVolumen()}></i>
                </li>
                <li className="list-inline-item mr-4 ml-4">
                  {isPlaying ? <div onClick={() =>togglePlay()}>
                      <i className="fas fa-pause fa-3x btn-hide" id="pause"></i>
                  </div>:<div onClick={() => togglePlay()}>
                  <i className="fas fa-play fa-3x btn-show" id="play"></i></div>}
                </li>
                <li className="list-inline-item mr-0 mt-2">
                  <i className="fas fa-volume-up fa-2x" id="up" onClick={()=> inscreaseVolumen()}></i>
                </li>
              </ul>

            </div>

          </div>
        </div>

      </div>
    </div>
    
    </div>
}
export default MusicBar