// import "./styles.css";
import {useEffect, useState} from 'react'
export default function Test() {
  const [color,setColor] = useState('red')
//   const [time,setTime] = useState(2000)
  useEffect(()=>{

    setTimeout(()=>{
    if(color == 'red') setColor('green')
    else if(color == 'green') setColor('orange')
    else setColor('red')
    },[color['red']])
  },[color])

  return (
    <div className="App bg-black">
      <p className='text-white'> {color}</p>
    </div>
  );
}

let q = {
  $expr : { 
    $gt : [{$multiply : ['$ratingval' , '$ratingcount']}, 4000]
  }
}