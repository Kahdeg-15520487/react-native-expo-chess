# react-native-expo-chess
  A react native chess game with on-phone 1v1 so you can play with a machine or with a friend as if your phone is a chess board, there are also puzzles to solve and practice your thinking skill.
  
## Reference link
  [react-native](https://github.com/facebook/react-native)  
  [expo](https://expo.io/)  
  [vs code](https://code.visualstudio.com/) 
  
  [How to chess](https://www.chess.com/learn-how-to-play-chess)
  
## Release
  [build](https://expo.io/builds/ee1f3e15-35c0-4f47-9ea9-bb08f168e80c)
  
## Function and Screenshot
  Note: Game will boot up on the default 'Play with friend' screen 
  
  HOME SCREEN
  
  ![home screen](screenshot/Screenshot_20181226-003148.png) 
  
  There's 3 thing on the home screen: Puzzle of the day, Play with machine and play with friend
  
  Puzzle of the day require Internet connection to work, taken from https://lichess.org/. It will take a chess board with orginized piece place in order to form puzzle for you to solve. You can use the button 'Copy this board' to play the puzzle with AI or your friend, detail down below
  
  You can push the button to play with a friend on the same device like it's a chess board or play with an AI (AI not very good so that it won't take over the world)
  
  AI use alpha-beta pruning search algorithm for predicting 1 move ahead.
  
  SETUP A GAME
  
  ![setup game](screenshot/Screenshot_20181226-003228.png)  
  
  When starting a new game with your friend or AI, a text box will appear contain a FEN string to initiate the board, press create to start a standard chess board
  
  When playing the puzzle or with a friend or an AI, you can use the red button 'Copy this board' to copy a FEN string (storing current location of the chess piece on the board) into your clipboard and paste it somewhere. 
  
  So when next time you need to continue the game you can paste this string in to the text box when creating a new game to replicate the position of the piece on the board last time you play. This can be use in a lot of way!
  
  HOT SEAT PLAY WITH FRIEND (OR AI IF YOU DON'T HAVE FRIEND)
  
  ![play screen](screenshot/Screenshot_20181226-003223.png) 
  
  Press on the chess piece, it will show the range of movement of the chess piece with dot on the board, tap where to go on the dot or tap the chess piece again to cancel movement.
  
  It have all the rule of original chess game like Castle move and Pawn promotion
 
## "Thing to improve on"
  Add a timer, score board, undo button.
  
  Improve the save and load mechanic
  
  Add a 'Highscore' list
  
  ...
  
## Build instruction
  ```
  yarn install
  expo build:android
  ```
