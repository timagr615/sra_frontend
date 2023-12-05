export function Pin({size = 8, color, rotation}){
    return (
      <div>
      <svg width="40px" height="40px" viewBox="0 0 15 15" version="1.1" id="ferry-JP" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: rotation != null ? `rotate(${rotation}deg)` : undefined }} 
      >
    <path 
    vectorEffect="non-scaling-stroke"
    strokeWidth="1px"
    strokeLinecap="round"
    strokeLinejoin="round"
    stroke="black"
    fill={color}
    d="M3,7c0,0.5,0,5,0,5c0,0.6,0.4,1,1,1h6c0.6,0,1-0.4,1-1c0,0,0-4.5,0-5c0-2-3-7-4-7S3,5,3,7z M5,11V8c0-3,2-5.5,2-5.5S9,5,9,8&#xA;&#x9;v3H5z"/>
  </svg>
      </div>
    )
  }