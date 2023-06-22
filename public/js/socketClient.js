function SocketClient() {
  var socket = io.connect();
  var engineGame;
  var headline = $("#headline");
  var messages = $("#messages");
  var chatBox = $("#chatBox");
  var chat = $("#chat");
  var roomIdForm = $("#roomIdForm");
  var roomIdInput = $("#roomIdInput");
  var newGameButton = $("#newGameButton");
  var showRoomId = $("#showRoomId");
  var nameForm = $("#nameForm");
  var nameInput = $("#nameInput");
  var uid = $("#Name");
  var name = $("#name");
  var joinGame = $("#joinGame");
  var hostName = $("#hostName");
  var MODE = $("#mode");
  var mode = MODE.text();
  var kotha = $("#kotha");
  var oplayer = $("#OnlineList");

  var game; // attach the game board and engine

  var room; // testing

  var board; // server sends opponent move to board

  var user = uid.text();
  var userace = uid.text();
  console.log(user);
  socket.emit("sendName", user);
  name.text("Welcome " + user);
  uid.hide();
  nameForm.hide();

  if (mode == "friend") {
    MODE.hide();
    oplayer.hide();
  } else if (mode == "online") {
    joinGame.hide();
    MODE.hide();
    kotha.hide();
  } else {
    joinGame.hide();
    MODE.hide();
    oplayer.hide();
    kotha.hide();
  }

  function scrollToBottom() {
    let messages = document.querySelector("#messages").lastElementChild;
    messages.scrollIntoView();
  }

  //New Added

  // var fs = require("fs");
  // var username;

  newGameButton.click(function () {
    if (board.isCompetingCpu()) {
      board.reset();
      //kotha.reset();
    } else {
      // kotha.reset();
      messages.empty();
      socket.emit("newGameRequest", room);
    }

    //board.reset();
  });

  joinGame.submit(function () {
    if (room) socket.emit("joinRequestTo", hostName.val());
    else {
      alert("You did not have a name");
    }
    //console.log('send join request');
    hostName.val("");
    return false;
  });

  $(document).on("click", ".onlineGameRequest", function () {
    if (room) socket.emit("joinRequestTo", $(this).data("name"));
    else {
      alert("You did not have a name");
    }
    //console.log('send join request');
    //hostName.val("");
    return false;
  });

  //Send message to server
  chatBox.submit(function () {
    //send this to the server
    //socket.emit("sendMessage",room,chat.val());
    socket.emit("sendMessage", room, chat.val());
    var li = $("<li/>").append(
      $("<p/>", {
        text: chat.val(),
        class: "message recipient-message",
      })
    );
    messages.append(li);
    scrollToBottom();
    chat.val("");
    return false;
  });

  socket.on("joinRequestFrom", function (socketId) {
    console.log("join request from " + socketId);
    if (board.isCompetingCpu()) {
      var confirm = window.confirm(
        "A user has send you a play request, Do you accept?"
      );
      if (confirm) {
        socket.emit("joinRequestAnswer", "yes", socketId);
        oplayer.hide();
        kotha.show();
        joinGame.hide();
        board.setOrientation("white");
        board.competingHuman();
        board.reset();
      }
    } else {
      socket.emit("joinRequestAnswer", "no", socketId);
    }
  });

  socket.on("newGameRequest", function () {
    var confirm = window.confirm("You won! Opponent wants to reset the game");
    if (confirm) {
      messages.empty();
      socket.emit("newGame", room);
    }
  });

  socket.on("newGame", function () {
    board.reset();
  });

  socket.on("roomId", function (roomId) {
    room = roomId;
    //showRoomId.text('Room ID : ' + room);
  });

  socket.on("joinRoom", function (newRoom, host) {
    window.alert("Joined room " + host);
    room = newRoom;
    socket.emit("joinRoom", room);
    board.setOrientation("black");
    oplayer.hide();
    kotha.show();
    joinGame.hide();
    board.competingHuman();
    board.reset();
  });
  socket.on("nameError", function (message) {
    window.alert(message);
    name.text("Unknown");
    nameForm.show();
  });

  socket.on("greetings", function (msg) {
    console.log(msg);
  });

  socket.on("move", function (moveData) {
    var from, to, promo;
    from = moveData.from;
    to = moveData.to;
    promo = moveData.promo;
    board.makeMove(from, to, promo);
    board.setFenPosition();
  });

  socket.on("update", function (users) {
    $("#onlinePlayers").empty();
    users.forEach((user) => {
      if (user.name !== userace) {
        $("#onlinePlayers").append(
          $('<li class="list-group-item">').html(
            '<button type="button" data-name="' +
              user.name +
              '" class="onlineGameRequest">' +
              user.name +
              "</button>"
          )
        );
      }
    });
  });

  //recieve message from other player
  socket.on("sendMessage", function (message) {
    var li = $("<li/>").append(
      $("<p/>", {
        text: message,
        class: "message sender-message",
      })
    );
    messages.append(li);
    scrollToBottom();
  });

  socket.on("opponentDisconnect", function () {
    alert("Opponent has left the room");
    board.setOrientation("white");
    if (mode == "online") {
      kotha.hide();
      oplayer.show();
    }
    if (mode == "friend") {
      joinGame.show();
    }
    messages.empty();
    board.competingCpu();
    board.reset();
  });

  return {
    setBoard: function (newBoard) {
      board = newBoard;
    },
    sendMove: function (playerColor, source, target, promo) {
      socket.emit("move", room, {
        color: playerColor,
        from: source,
        to: target,
        promotion: promo || "",
      });
    },
    requestNewGame: function () {
      socket.emit("newGameRequest", room);
    },
  };
}
