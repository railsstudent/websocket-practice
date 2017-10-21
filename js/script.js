$(document).ready(() => {
  // get some data from server

  var $licensePlate = $('.license-plate p');
  var $slot = $('.parking-slot p');
  var $availableInfo = $('.available-info');
  var $status = $availableInfo.find('.status');
  var $statusText = $availableInfo.find('.status p');
  var $availHours = $availableInfo.find('.available-hour p');
  var $p = $('p');

  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  // if browser doesn't support WebSocket, just show
  // some notification and exit
  if (!window.WebSocket) {
    console.log('Websocket is not supported');
    return;
  } else {
    console.log('Websocket is supported');
  }

  const connection = new WebSocket('ws://192.168.164.84:1337');

  connection.onopen = function () {
     // connection is opened and ready to use
     console.log('Connection opened');
  };

  connection.onerror = function (error) {
    // an error occurred when sending/receiving data
    console.error(error);
  };

  connection.onmessage = function (message) {
    try {
      console.log(message.data);
      const data = JSON.parse(message.data);
      console.log(data);
      if (data) {
          $p.css('animation-name', 'fadein');
          $p.css('animation-duration', '5s');
          $status.css('animation-name', 'fadein');
          $status.css('animation-duration', '5s');

          $licensePlate.html(data && data.plate || '');
          $slot.html(data && data.slot && `No. ${data.slot}`  || '');
          if (data.status === 'Available') {
            $availHours.html(data.time);
            $status.addClass('available');
            $status.removeClass('unavailable');
            $availHours.css('display', 'table');
            $availHours.css('background', '#fff');
          } else if (data.status === 'Unavailable') {
            $status.addClass('unavailable');
            $status.removeClass('available');
            $availHours.css('display', 'none');
          }
          $statusText.html(data && data.status || '');
      }
    } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ',
          message.data);
      return;
    }
    // handle incoming message
  };

  $p.on('webkitAnimationEnd oanimationend msAnimationEnd animationEnd', e => {
    const $target = $(e.target);
    $target.css('animation-name', '');
    $target.css('animation-duration', '');
  });

  $status.on('webkitAnimationEnd oanimationend msAnimationEnd animationEnd', e => {
    const $target = $(e.target);
    $status.css('animation-name', '');
    $status.css('animation-duration', '');
  });
});
