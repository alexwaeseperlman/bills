import { Anybody } from "next/font/google";

function rotate(dim : string, modelId : any, ref : any) {

    ref.current.contentWindow.postMessage({
        "type": "rotate",
        "dim": dim,
        "modelId": modelId
    }, '*');
}

function scale(delta : any, modelId : any, ref : any) {
    ref.current.contentWindow.postMessage({
        "type": "scale",
        "delta": delta,
        "modelId": modelId,
    })
}
function setPos(pos : any, modelId : any, ref : any) {
    ref.current.contentWindow.postMessage({
        "type": "setPos",
        "modelId": modelId,
        "pos": pos,
    })
}


function requestPos(modelId : any, ref : any) {
    ref.current.contentWindow.postMessage({
        "type": "requestPos",
        "modelId": modelId,
    })
}
export { rotate, setPos, requestPos, scale };