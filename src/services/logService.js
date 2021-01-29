import Raven from 'raven-js';

function init () {
    console.log('in info');
}

function log (error) {
    console.log('in error: ', error);
}

export default {
    init,
    log
}