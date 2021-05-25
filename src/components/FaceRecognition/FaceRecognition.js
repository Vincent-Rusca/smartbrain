import './FaceRecognition.css';

// https://www.verywellmind.com/thmb/z-mHv6NUGXNkxuqMD1s2nRe3LRQ=/2122x1194/smart/filters:no_upscale()/family-parents-grandparents-Morsa-Images-Taxi-56a906ad3df78cf772a2ef29.jpg
// https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-2.jpg
const FaceRecognition = ({ imageUrl, boxes }) => {
  const boxesKeys = Object.keys(boxes || {});

  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputImage' src={imageUrl} alt='' width='500px' heigh='auto' />
        {boxesKeys.map(key => (
          <div 
            className='bounding-box' 
            style={{
              top: boxes[key].topRow, 
              right: boxes[key].rightCol, 
              bottom: boxes[key].bottomRow, 
              left: boxes[key].leftCol
            }}>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FaceRecognition;