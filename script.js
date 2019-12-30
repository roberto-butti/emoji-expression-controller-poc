// 001 - Access to DOM for video and face incon
const video = document.getElementById('cam');
const face = document.getElementById('face');

// 002 - Load models for Face Detection and Face EXpression
Promise.all(
  [
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    //faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    //faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]
).then(startvideo)


function startvideo() {
  // 003 - Access to Cam and display it on video DIV
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.log(err)
  )
}

// 004 - Define the array with emoji
let statusIcons = {
  default: '😎',
  neutral: '🙂',
  happy: '😀',
  sad: '😥',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😳'
}

// 005 - Add a listener once the Video is played
video.addEventListener('play', () => {
  // 006 - Set the default Emoji
  face.innerHTML = statusIcons.default
  // 007 - setInterval to detect face/espression periodically (every 1000 milliseconds)
  const milliseconds = 2000
  setInterval(async () => {
    // 008 - Wait to detect face with Expression
    const detection = await
      faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        //.withFaceLandmarks()
        .withFaceExpressions()
    // 009 - detectAllFaces retruns an array of faces with some interesting attributes
    if (detection.length > 0) {
      // 010 - walk through all faces detected
      detection.forEach(element => {
        console.log(element.expressions)
        /**
         * 011 - each face element has a expressions attribute
         * for example:
         * neutral: 0.33032259345054626
         * happy: 0.0004914478631690145
         * sad: 0.6230283975601196
         * angry: 0.042668383568525314
         * fearful: 0.000010881130037887488
         * disgusted: 0.003466457361355424
         * surprised: 0.000011861078746733256
         */
        let status = "";
        let valueStatus = 0.0;

        for (const [key, value] of Object.entries(element.expressions)) {
          if (value > valueStatus) {
            status = key
            valueStatus = value;
          }
        }
        //console.log(status, valueStatus)
        // 012 - once we have the highest scored expression (status) we display the right Emoji
        face.innerHTML = statusIcons[status]
      });
    } else {
      //face.innerHTML = statusIcons.default;
    }
  }, milliseconds);
})