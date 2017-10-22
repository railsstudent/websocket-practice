$(document).ready(() => {
  // get some data from server

  // parking-space $ http-server . -p 3001 -a 192.168.164.84

  var $licensePlate = $('.license-plate p');
  var $availSlotParent = $('.parking-slot-available');
  var $availSlot = $availSlotParent.find('p');
  var $unavailSlotParent = $('.parking-slot-unavailable');
  var $unavailSlot = $unavailSlotParent.find('p');
  var $availableInfo = $('.available-info');
  var $status = $availableInfo.find('.status');
  var $statusText = $availableInfo.find('.status p');
  var $availHours = $availableInfo.find('.available-hour');
  var $availHoursText = $availableInfo.find('.available-hour p');

  var $p = $('p');
  var $container = $('.container');

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

  const connection = new WebSocket('ws://192.168.164.70:1337');

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
          $availableInfo.css('animation-name', 'fadein');
          $availableInfo.css('animation-duration', '5s');

          if (data.status.toLowerCase() === 'available') {
            $licensePlate.parent().css('display', 'none');
            $licensePlate.removeClass('add-border')

            $status.addClass('available')
              .removeClass('unavailable');
            $availableInfo.css('background', '#7dc05e');
            $availHoursText.css('display', 'table')
              .css('color', '#fff')
              .html(data.time);
            $availHours.css('display', 'block');
            $unavailSlotParent.css('display', 'none');
            $availSlotParent.css('display', 'block');
            $availSlot.html(data && data.slot && 'NO.' + data.slot || '');

            $container.removeClass('add-flex-column');
          } else if (data.status.toLowerCase() === 'unavailable') {
            $licensePlate.parent().css('display', 'block');
            $licensePlate.html(data && data.plate || '')
                        .addClass('add-border');
            $status.addClass('unavailable')
                    .removeClass('available');
            $availHours.css('display', 'none');
            $availableInfo.css('background', '#ea5c2d');
            $availSlotParent.css('display', 'none');
            $unavailSlotParent.css('display', 'block');
            $unavailSlot.html(data && data.slot && 'NO.' + data.slot || '')
                .css('display', 'block');
            $container.removeClass('add-flex-column');
          } else if (data.status.toLowerCase() === 'license plate mismatch') {
            $licensePlate.parent().css('display', 'block');
            $licensePlate.html(data && data.plate || '')
                        .addClass('add-border');
            $status.addClass('unavailable')
                    .removeClass('available');
            $availHours.css('display', 'none');
            $availableInfo.css('background', 'yellow');
            $availSlotParent.css('display', 'none');
            $unavailSlotParent.css('display', 'block');
            $unavailSlot.html(data && data.slot && 'NO.' + data.slot || '')
                .css('display', 'block');

            $container.addClass('add-flex-column');
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

  $availableInfo.on('webkitAnimationEnd oanimationend msAnimationEnd animationEnd', e => {
    $availableInfo.css('animation-name', '');
    $availableInfo.css('animation-duration', '');
  });
});
