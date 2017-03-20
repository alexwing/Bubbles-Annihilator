
function onError() {
    console.log('onError!');
}
function onSuccess(datosAceleracion) {
    parent.acelometroX = datosAceleracion.x;
    parent.acelometroY = datosAceleracion.y;
}
function watchAccelerometer() {
  parent.navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});

}
