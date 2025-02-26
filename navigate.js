let video = document.querySelector("video")
let recordBtnCont = document.querySelector(".record-btn-cont")
let recordBtn = document.querySelector(".record-btn")
let captureBtnCont = document.querySelector(".capture-btn-cont")
let captureBtn = document.querySelector(".capture-btn")
let transparentColor = "transparent";

let recorder;
let recorderFlag = false
let chunks = []

let constraints = {
    audio: false,
    video: true
}
let timerID;
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream

    recorder = new MediaRecorder(stream)
    recorder.addEventListener("start", (e) => {
        chunks = []
    })
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data)
    })
    recorder.addEventListener("stop", (e) => {
        let blob = new Blob(chunks, { type: "video/mp4" })
        let videoURL = URL.createObjectURL(blob)
        let a = document.createElement("a")
        a.download = "stream.mp4"
        a.href = videoURL
        a.click()
    })
    
    recordBtnCont.addEventListener("click", (e) => {
        if(!recorder) return;

        recorderFlag = !recorderFlag
        if(recorderFlag){
            recorder.start()
            recordBtn.classList.add("scale-record")
            startTimer()
        }
        else{
            recorder.stop()
            recordBtn.classList.remove("scale-record")
            stopTimer()
        }
    })
    let timer = document.querySelector(".timer")
    let counter = 0
    function startTimer(){
        timer.style.display = "block"
        function displayTimer(){
            let totalSeconds = counter
            let hours = Number.parseInt(totalSeconds/3600)

            totalSeconds = totalSeconds % 3600
            let minutes = Number.parseInt(totalSeconds / 60)
            totalSeconds = totalSeconds % 60
            let seconds = totalSeconds

            hours = (hours < 10)?`0${hours}`: hours
            minutes = (minutes < 10)? `0${minutes}`: minutes
            seconds = (seconds < 10)? `0${seconds}`: seconds
            timer.innerText = `${hours}:${minutes}:${seconds}`

            counter++
        }

        timerID = setInterval(displayTimer, 1000)
    }
    function stopTimer(){
        clearInterval(timerID)
        timer.innerText = "00:00:00"
        timer.style.display = "none"
    }

    captureBtnCont.addEventListener("click", (e) => {
        captureBtn.classList.add("scale-capture")

        let canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        let imageURL = canvas.toDataURL()

        let tool = canvas.getContext("2d")
        tool.drawImage(video, 0, 0, canvas.width, canvas.height)
        tool.fillStyle = transparentColor
        tool.fillRect = (0, 0, canvas.width, canvas.height)


        let a = document.createElement("a")
        a.download = "Image.jpg"
        a.href = imageURL
        a.click()
    })

})
let filter = document.querySelector(".filter-layer")
let allFilterEle = document.querySelectorAll(".filter")

allFilterEle.forEach((filterEle) => {
    filterEle.addEventListener("click", (e) => {
        transparentColor = getComputedStyle(filterEle).getPropertyValue("background-color")
        filter.style.backgroundColor = transparentColor
    })
})
