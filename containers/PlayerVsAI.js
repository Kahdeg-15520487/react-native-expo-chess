import React, {
  Component
} from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  FormData,
  Clipboard
} from 'react-native';

import {
  Chess
} from 'chess.js';

import {
  Button,
  Board,
  Clock
} from '../components';

const Constant = require('./Constant.js');

export default class PlayerVsLichessAI extends Component {
  static navigationOptions = {
    title: 'Play with the machine',
  };

  constructor(props) {
    super(props);

    const {
      time
    } = this.props.navigation.state.params;
    this.latestClock = {
      white: time,
      black: time,
    };

    this.state = {
      initialized: false,
      invitationId: '',
      game: new Chess(),
      gameStarted: false,
      userColor: '',
      whiteClock: time,
      blackClock: time,
      victor: '',
      resigned: false,
      inCheck: undefined,
      isAi: false,
    };
  }

  componentDidMount() {
    //this._loadInitialState().done();
    this.createGame();
  }

  _loadInitialState = async () => {
    // try {
    //   await dongSound.loadAsync(require('../assets/sounds/dong.mp3'));
    // } catch (error) {
    //   // An error occurred!
    // }
  };

  componentWillUnmount() {
    clearInterval(this.interval);
    this.ws = null;
  }

  resign = () => {
    this.sendMessage({
      t: 'resign'
    });
    this.setState({
      resigned: true
    });
  };

  createGame() {
    const {
      navigation
    } = this.props;
    console.log(navigation);
    const param = navigation.getParam('config', undefined);
    console.log("param: "+param);
    const playConfig = JSON.parse(param);
    const { game, userColor } = this.state;

    console.log(playConfig.fen);
    console.log(game.load(playConfig.fen));
    console.log("created");
    this.setState({
      initialized: true,
      userColor: game.turn(),
      fen: playConfig.fen
    });
  }

  doAIMove = () => {
    const { game, userColor, isAi } = this.state;
    var possibleMoves = game.moves();

    // game over
    if (possibleMoves.length === 0) return;
    console.log(possibleMoves.join(', '));

    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    console.log(possibleMoves[randomIndex]);
    const isLegal = game.move(possibleMoves[randomIndex]);
    console.log(isLegal);
    const from = isLegal.from;
    const to = isLegal.to;
    console.log("from: "+from);
    console.log("to: "+to);
    console.log("ai color: "+userColor);
    game.move({ from: from,to: to, promotion: 'q' });

    if(game.in_check()=== true){
      this.setState({ inCheck: userColor === 'w' ? "black" : "white" });
    }
    else{
      this.setState({ inCheck: undefined });
    }

    if(game.in_checkmate() === true){
      this.setState({ victor: userColor === 'w' ? "white" : "black" });
    }

    this.setState({
      initialized: true,
      userColor: game.turn(),
      fen: game.fen()
    });
  }

  onMove = ({ from, to }) => {
    console.log("from: "+from);
    console.log("to: "+to);
    const { game, userColor } = this.state;
    game.move({ from: from,to: to, promotion: 'q' });

    if(game.in_check()=== true){
      this.setState({ inCheck: userColor === 'w' ? "black" : "white" });
    }
    else{
      this.setState({ inCheck: undefined });
    }

    if(game.in_checkmate() === true){
      this.setState({ victor: userColor === 'w' ? "white" : "black" });
    }

    this.setState({
      initialized: true,
      userColor: game.turn(),
    });
      
    this.doAIMove();
  };

  shouldSelectPiece = piece => {
    const { game, userColor, victor } = this.state;
    console.log(userColor+" select: "+piece.color+piece.type);
    const turn = game.turn();
    if (
      victor ||
      game.in_checkmate() === true ||
      game.in_draw() === true ||
      turn !== userColor ||
      piece.color !== userColor
    ) {
      return false;
    }
    return true;
  };

  copyFen = async ()=>{
    const{game} = this.state;
    await Clipboard.setString(game.fen());
    ToastAndroid.show('Board copied ',ToastAndroid.SHORT);
  }

  renderVictorText() {
    const {
      victor
    } = this.state;

    if (victor) {
      return ( <Text style = {styles.statusText} >
        Game over, {victor}
        is victorious!
        </Text>
      );
    }
    return null;
  }

  render() {
    const {
      game,
      initialized,
      fen,
      userColor,
      whiteClock,
      blackClock,
      victor,
      resigned,
      gameStarted,
    } = this.state;
    //const isReverseBoard = userColor === 'b';
    const turn = game.turn();
    const historyLength = game.history().length;
    const whiteTurn = historyLength > 0 && turn === 'w' && !victor;
    const blackTurn = historyLength > 1 && turn === 'b' && !victor;

    if (!initialized) {
      return <ActivityIndicator style={styles.container} animating />;
    }
    
    return (
      <View style={styles.container} >
        {this.renderVictorText()}
        <Board
          ref={board => this.board = board}
          fen={fen}
          color={userColor}
          shouldSelectPiece={this.shouldSelectPiece}
          onMove={this.onMove}
        />
          <Button
            style={styles.resignButton}
            text={"Copy this board"}
            onPress={this.copyFen}
          />
      </View>
    );
  }
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: 'black',
    },
    statusText: {
      color: 'red',
      fontSize: 16,
      margin: 4,
    },
    resignButton: {
      width: 200,
      backgroundColor: 'red',
    },
  });