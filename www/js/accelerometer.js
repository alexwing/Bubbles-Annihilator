function watchAccelerometer() {
    function onError() {
        console.log('onError!');
    }
    function onSuccess(datosAceleracion) {
        acelometroX = datosAceleracion.x;
        acelometroY = datosAceleracion.y;
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
}