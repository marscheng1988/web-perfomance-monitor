function sendXrh (){
    let _xrh = new XMLHttpRequest
    _xrh.open("get","http://0.0.0.0:3001/get-delay-3s",true)
    _xrh.onreadystatechange = function (params) {
        console.log('addScript-stateChanche',params)
    }
    _xrh.send()
}
sendXrh()