// const imageUpload = document.getElementById('imageUpload');

// Promise.all([
//   faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//   faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//   faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
// ]).then(start)

// async function start() {
//   const container = document.createElement('div');
//   container.style.position = 'relative';
//   document.body.append(container)
//   let image
//   let canvas
//   document.body.append('Loaded')
//   imageUpload.addEventListener('change', async () => {
//     if (image) {
//       image.remove();
//     }
//     if (canvas) {
//       canvas.remove();
//     }
//     image = await faceapi.bufferToImage(imageUpload.files[0]);
//     container.append(image);
//     canvas = faceapi.createCanvasFromMedia(image);
//     container.append(canvas);
//     const displaySize = { 
//       width: image.width,
//       height: image.height 
//     };
//     faceapi.matchDimensions(canvas, displaySize);
//     const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors();
//     const resizedDetections = faceapi.resizeResults(detections, displaySize);

//     const leftEyeBbrow = resizedDetections[0].landmarks.getLeftEyeBrow();
//     const rightEyeBbrow = resizedDetections[0].landmarks.getRightEyeBrow();

//     const EyeBrowDist = (rightEyeBbrow[0].x - leftEyeBbrow[4].x);
//     pointToPin = {
//       x: rightEyeBbrow[0].x - (EyeBrowDist / 2),
//       y: rightEyeBbrow[0].y - (EyeBrowDist * 0.7),
//     }

//     const text = 'O'
//     // see DrawTextField below
//     const drawOptions = {
//       anchorPosition: 'TOP_LEFT',
//       backgroundColor: 'rgba(0, 0, 0, 1)'
//     }
//     const drawBox = new faceapi.draw.DrawTextField(text, pointToPin, drawOptions)
//     drawBox.draw(canvas);
//   })
// }


const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    const leftEyeBbrow = resizedDetections[0].landmarks.getLeftEyeBrow();
    const rightEyeBbrow = resizedDetections[0].landmarks.getRightEyeBrow();

    const EyeBrowDist = (rightEyeBbrow[0].x - leftEyeBbrow[4].x);

    const pointToPin = {
      x: rightEyeBbrow[0].x - (EyeBrowDist / 2),
      y: rightEyeBbrow[0].y - (EyeBrowDist * 0.7),
    }

    const text = 'O';
    // see DrawTextField below
    const drawOptions = {
      anchorPosition: 'TOP_LEFT',
      backgroundColor: 'rgba(0, 0, 0, 1)'
    }
    const drawBox = new faceapi.draw.DrawTextField(text, pointToPin, drawOptions)
    drawBox.draw(canvas);

    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  }, 100)
})

