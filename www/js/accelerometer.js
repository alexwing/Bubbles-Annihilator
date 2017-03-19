
    function onError() {
        console.log('onError!');
    }
    function onSuccess(datosAceleracion) {
        parent.acelometroX = datosAceleracion.x;
        parent.acelometroY = datosAceleracion.y;
    }
    navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 10});
