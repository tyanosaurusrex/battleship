var shipType = document.querySelector('.shipType');
var shipPosition = document.querySelector('.shipPosition');
var shipOrientation = document.querySelector('.shipOrientation');
var addBtn = document.querySelector('.addBtn');
var randomBtn = document.querySelector('.randomBtn');
var switchBtn = document.querySelector('.switchBtn');
var playBtn = document.querySelector('.playBtn');

var shootPosition = document.querySelector('.shootPosition');
var shootBtn = document.querySelector('.shootBtn');
var cheatShotBtn = document.querySelector('.cheatShotBtn');
var shootLogs = document.querySelector('.shootLogs');
var cheatBoard = document.querySelector('.cheatBoard');
cheatBoard.style.whiteSpace = 'pre';

var nowPlay = document.querySelector('.nowPlay');
var gameBoard = document.querySelector('.gameBoard');
gameBoard.style.whiteSpace = 'pre';
// playBtn.disabled = true;
shootPosition.disabled = true;
shootBtn.disabled = true;
var nowPlaying = 1;
var gameOngoing = 0;
var playerBoard;
var cheatShot = 1;
var cheat = false;
var shotCount = 1;

var player1 = {
  player: 'Player 1',
  ships: [
    {ship: 'carrier', size: 0},
    {ship: 'battleship', size: 0},
    {ship: 'destroyer', size: 0},
    {ship: 'submarine', size: 0},
    {ship: 'patrolboat', size: 0},
  ],
  boards: createBoard()
}

var player2 = {
  player: 'Player 2',
  ships: [
    {ship: 'carrier', size: 0},
    {ship: 'battleship', size: 0},
    {ship: 'destroyer', size: 0},
    {ship: 'submarine', size: 0},
    {ship: 'patrolboat', size: 0},
  ],
  boards: createBoard()
}

playerBoard = (nowPlaying === 1) ? player1 : player2;
gameBoard.textContent = printBoard(playerBoard.boards);

var shipRef = [
  {ship: 'carrier', shipCode: 'c', size: 5},
  {ship: 'battleship', shipCode: 'b', size: 4},
  {ship: 'destroyer', shipCode: 'd', size: 3},
  {ship: 'submarine', shipCode: 's', size: 3},
  {ship: 'patrolboat', shipCode: 'p', size: 2},
]

var guessedBoard1 = createBoard();
var guessedBoard2 = createBoard();

function createBoard(){
  var boards = [];
  for(var i=1; i<=10; i++){
    boards[i] = [];
    for(var j=1; j<=10; j++){
      boards[i][j] = '';
    }
  }
  return boards;
}

function printBoard(boards){
  var printBoard = '';
  for(var i=0; i<=10; i++){
    for(var j=0; j<=10; j++){
      if (i === 0 && j === 0){
        printBoard += '#   ';
      } else if (i !== 0 && j === 0){
        printBoard += String.fromCharCode(96 + i).toUpperCase().padEnd(4, ' ');
      } else if (i === 0 && j !== 0){
        printBoard += String(j).padEnd(4, ' ');
      } else if (j !== 0 && i !== 0){
        var board = (boards[i][j] !== '') ? boards[i][j] : '-';
        printBoard += board.padEnd(4, ' ');
      }
    }
    printBoard += '\n';
  }
  return printBoard;
}

addBtn.addEventListener('click', setShipsManual);

function setShipsManual(){
  var type = shipType.value;
  var position = shipPosition.value.toUpperCase();
  var orientation = shipOrientation.value;
  var player = (nowPlaying === 1) ? player1 : player2;

  if(position === '' || position.length > 2){
    alert('Posisi kapal tidak boleh kosong dengan format e.g. A1');
  } else {
    var row = position.charCodeAt(0) - 64;
    var col = position.substring(1, position.length);

    addShip(player, type, orientation, row, col, false);
    gameBoard.textContent = printBoard(player.boards);
  }
}

randomBtn.addEventListener('click', setShipsRandom);

function setShipsRandom(){
  var type = ['carrier', 'battleship', 'destroyer', 'submarine', 'patrolboat'];
  var orientation = ['horizontal', 'vertical'];
  var player = (nowPlaying === 1) ? player1 : player2;

  var typeIndex = Math.floor(Math.random() * 5);
  var orientationIndex = Math.floor(Math.random() * 2);

  var typeRandom = type[typeIndex];
  var orientationRandom = orientation[orientationIndex];
  var row = Math.floor(Math.random() * 10) + 1;
  var col = Math.floor(Math.random() * 10) + 1;

  try {
    addShip(player, typeRandom, orientationRandom, row, col);
    gameBoard.textContent = printBoard(player.boards);
  } catch (e) {
    setShipsRandom();
  }
}

function addShip(player, type, orientation, row, col, random = true){
  var boardPlaying = player.boards;
  
  if (row < 1 || row > 10 || col < 1 || col > 10){
    if (random === false){
      alert('Masukkan hanya baris A-J dan kolom 1-10');
    }
    throw error;
  } else {
    var ship = shipRef.filter(item => item.ship === type);
    var checkPlacedShip = player.ships.filter(item => item.ship === type && item.size === 0);
    
    if (checkPlacedShip.length === 1){
      if (checkRange(orientation, row, col, ship[0])){
        if (checkPosition(boardPlaying, orientation, row, col, ship[0])){
          if (orientation === 'horizontal'){
            for(var j=col; j< ship[0].size + Number(col); j++){
              boardPlaying[row][j] = ship[0].shipCode;
            }
          } else if (orientation === 'vertical'){
            for(var i=row; i< ship[0].size + Number(row); i++){
              boardPlaying[i][col] = ship[0].shipCode;
            }
          }

          player.ships.map(item => {
            if (item.ship === type){
              item.size = ship[0].size;
            }
          });

          if (checkAllShip(player)){
            addBtn.disabled = true;
            randomBtn.disabled = true;
          }
        } else {
          if (random === false){
            alert('Kapal bertabrakan dengan kapal lainnya. Pilih posisi lain');
          }
          throw error;
        }
      } else {
        if (random === false){
          alert('Papan tidak muat');
        }
        throw error;
      }
    } else {
      if (random === false){
        alert('Kapal tersebut sudah ada di papan');
      }
      throw error;
    }
  }
  return true;
}

function checkPosition(boardPlaying, orientation, row, col, ship){
  if (orientation === 'horizontal'){
    for(var j=col; j< ship.size + Number(col); j++){
      if (boardPlaying[row][j] !== ''){
        return false;
      }
    }
  } else if (orientation === 'vertical'){
    for(var i=row; i< ship.size + Number(row); i++){
      if (boardPlaying[i][col] !== ''){
        return false;
      }
    }
  }
  return true;
}

function checkRange(orientation, row, col, ship){
  if (orientation === 'horizontal'){
    if (Number(col) + ship.size - 1 > 10){
      return false;
    }
  } else if (orientation === 'vertical') {
    if (Number(row) + ship.size - 1 > 10){
      return false;
    }
  }
  return true;
}

function checkAllShip(player){
  for (var i=0; i<5; i++){
    if(player.ships[i].size === 0){
      return false;
    }
  }
  return true;
}

switchBtn.addEventListener('click', switchPlayer);

function switchPlayer(){
  nowPlaying = (nowPlaying === 1) ? 2 : 1;
  playerBoard = (nowPlaying === 1) ? player1 : player2;
  var shootingBoard = (nowPlaying === 1) ? guessedBoard2 : guessedBoard1;
  var cheatingBoard = (nowPlaying === 1) ? player2.boards : player1.boards;
  
  nowPlay.textContent = 'Player ' + nowPlaying;
  shipType.value = 'carrier';
  shipPosition.value = '';
  shipOrientation.value = 'horizontal';
  
  if (gameOngoing === 0){
    if (checkAllShip(playerBoard)){
      addBtn.disabled = true;
      randomBtn.disabled = true;
    } else {
      addBtn.disabled = false;
      randomBtn.disabled = false;
    }
    gameBoard.textContent = printBoard(playerBoard.boards);
  } else if (gameOngoing === 1){
    shootBtn.disabled = false;
    cheatShotBtn.disabled= false;
    cheatBoard.textContent = printBoard(cheatingBoard);
    gameBoard.textContent = printBoard(shootingBoard);
    shootPosition.value = '';
    shootLogs.textContent = 'Status : ';
  }
}

playBtn.addEventListener('click', startGame);

function startGame(){
  nowPlay.textContent = 'Player ' + nowPlaying;
  shipType.value = 'carrier';
  shipPosition.value = '';
  shipOrientation.value = 'horizontal';

  shipType.disabled = true;
  shipPosition.disabled = true;
  shipOrientation.disabled = true;
  addBtn.disabled = true;
  randomBtn.disabled = true;
  playBtn.disabled = true;
  shootPosition.disabled = false;
  shootBtn.disabled = false;
  
  nowPlaying = 1;
  nowPlay.textContent = 'Player ' + nowPlaying;
  gameBoard.textContent = printBoard(guessedBoard2);
  cheatBoard.textContent = printBoard(player2.boards);
  gameOngoing = 1;
}

shootBtn.addEventListener('click', play);

function play(){
  var shootPos = shootPosition.value.toUpperCase();

  var row = shootPos.charCodeAt(0) - 64;
  var col = shootPos.substring(1, shootPos.length);
  var opposite = (nowPlaying === 1) ? player2 : player1;
  
  if(shoot(opposite, shootPos, row, col)){
    if (cheat === true){
      shotCount++;
      if (shotCount > 5){
        shootBtn.disabled = true;
        cheat = false;
        shotCount = 1;
      }
    } else {
      shootBtn.disabled = true;
      cheatShot.disabled = true;
    }

    if (checkWin(opposite.ships)){
      alert('Player '+ nowPlaying+' menang');
      shootPosition.disabled = true;
      shootBtn.disabled = true;
    }
  }
}

cheatShotBtn.addEventListener('click', playCheat)

function playCheat(){
  alert('Player ' + nowPlaying + ' mendapatkan kesempatan 5 kali menembak');
  cheatShotBtn.disabled = true;
  cheat = true;
}

function shoot(opposite, shootPos, row, col){
  if (shootPos === '' || row < 1 || row > 10 || col < 1 || col > 10){
    alert('Koordinat tembakan hanya di antara baris A-J dan kolom 1-10');
    return false;
  } else {
    var shootingBoard = (nowPlaying === 1) ? guessedBoard2 : guessedBoard1;
    var oppositeBoard = opposite.boards;

    if (shootingBoard[row][col] !== ''){
      alert('Sudah pernah ditembak');
      return false;
    } else {
      if (oppositeBoard[row][col] === ''){
        shootingBoard[row][col] = 'O';
        oppositeBoard[row][col] = 'O';
        shootLogs.textContent = 'Status : Tembakan meleset';
      } else if (oppositeBoard[row][col] !== ''){
        var ship = shipRef.filter(item => item.shipCode === oppositeBoard[row][col]);
        shootingBoard[row][col] = 'X';
        oppositeBoard[row][col] = 'X';
        
        shootLogs.textContent = 'Status : Berhasil menembak ' + ship[0].ship;

        opposite.ships.map(item => {
          if (item.ship === ship[0].ship){
            item.size -= 1;
          }
        });
      }
      
      gameBoard.textContent = printBoard(shootingBoard); 
      cheatBoard.textContent = printBoard(oppositeBoard);
    }
  }
  return true;
}

function checkWin(oppositeShips){
  for (var i=0; i<5; i++){
    if (oppositeShips[i].size !== 0){
      return false;
    }
  }
  return true;
}