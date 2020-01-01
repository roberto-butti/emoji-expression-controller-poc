// 001 - Access to DOM for video and face incon
const video = document.getElementById('cam');
const face = document.getElementById('face');

// 002 - Load models for Face Detection and Face EXpression
Promise.all(
  [
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
  ]
).then(startvideo)


async function startvideo() {
  console.info("Models loaded, now I will access to WebCam")
  // 003 - Access to Cam and display it on video DIV
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  })
  video.srcObject = stream

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

function detectExpression() {
  // 005 - Set the default Emoji
  face.innerHTML = statusIcons.default
  // 006 - setInterval to detect face/espression periodically (every 500 milliseconds)
  const milliseconds = 500
  setInterval(async () => {
    // 007 - Wait to detect face with Expression
    const detection = await
      faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions()
    // 008 - detectAllFaces retruns an array of faces with some interesting attributes
    if (detection.length > 0) {
      // 009 - walk through all faces detected
      detection.forEach(element => {
        /**
         * 010 - each face element has a expressions attribute
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
        // 011 - once we have the highest scored expression (status) we display the right Emoji
        face.innerHTML = statusIcons[status]
      });
    } else {
      console.log("No Faces")
      //face.innerHTML = statusIcons.default;
    }
  }, milliseconds);
}

// 012 - Add a listener once the Video is played
video.addEventListener('playing', () => {
  detectExpression()
})
