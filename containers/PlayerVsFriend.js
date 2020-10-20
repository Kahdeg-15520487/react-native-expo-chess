import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Clipboard, ToastAndroid } from 'react-native';

import { Chess } from 'chess.js';

import { Button, Board, Clock } from '../components';

var Constant = require('./Constant.js');
//const dongSound = new Expo.Audio.Sound();

export default class PlayerVsFriend extends Component {
  // static navigationOptions = {
  //   title: 'Play with a friend',
  // };

  constructor(props) {
    super(props);

    const {
      time,
      config
    } = props.route.params;
    this.clientId = Math.random().toString(36).substring(2);

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
      config: config
    };
  }

  getNavigationParams() {
    return this.props.navigation.state.params || {}
  }

  componentDidMount() {
    this._loadInitialState().done();
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
    this.gameSocketUrl = null;
    this.ws = null;
  }

  resign = () => {
    this.sendMessage({ t: 'resign' });
    this.setState({ resigned: true });
  };

  createGame() {
    const {
      navigation
    } = this.props;

    const playConfig = JSON.parse(this.state.config);
    const { game, userColor } = this.state;

    console.log(game.load(playConfig.fen));
    this.setState({
      initialized: true,
      userColor: game.turn(),
      fen: playConfig.fen
    });
  }

  joinGame(gameId) {
  }

  retrieveSocketUrl(socketId) {
  }

  createSocket = (socketUrl, socketId) => {

  };

  onMove = ({ from, to }) => {
    console.log("from: " + from);
    console.log("to: " + to);
    const { game, userColor } = this.state;
    game.move({ from: from, to: to, promotion: 'q' });

    if (game.in_check() === true) {
      console.log(userColor === 'w' ? "black" : "white" + "in check");
      this.setState({ inCheck: userColor === 'w' ? "black" : "white" });
    }
    else {
      console.log(userColor === 'w' ? "black" : "white" + " not in check");
      this.setState({ inCheck: undefined });
    }

    if (game.in_checkmate() === true) {
      console.log(userColor === 'w' ? "black" : "white" + "in checkmate");
      this.setState({ victor: userColor === 'w' ? "white " : "black " });
    }

    this.setState({
      initialized: true,
      userColor: game.turn(),
    });
    console.log(game.turn());
  };

  shouldSelectPiece = piece => {
    const { game, userColor, victor } = this.state;
    const turn = game.turn();
    console.log(userColor);
    console.log(turn + " select: " + piece.color + piece.type);
    if (
      victor ||
      game.in_checkmate() === true ||
      game.in_draw() === true ||
      turn !== userColor ||
      piece.color !== userColor
    ) {
      console.log(victor);
      console.log(game.in_checkmate() === true);
      console.log(game.in_draw() === true);
      console.log(turn !== userColor);
      console.log(piece.color !== userColor);
      console.log("cant select");
      return false;
    }
    console.log("can select");
    return true;
  };

  copyFen = async () => {
    const { game } = this.state;
    await Clipboard.setString(game.fen());
    ToastAndroid.show('Board copied ', ToastAndroid.SHORT);
  }

  renderVictorText() {
    const { victor, inCheck } = this.state;

    if (victor) {
      return (
        <Text style={styles.statusText}>
          Game over, {victor} is victorious!
        </Text>
      );
    }
    if (inCheck) {
      return (
        <Text style={styles.statusText}>
          {inCheck} is in check
        </Text>
      );
    }
    return (<Text style={styles.statusText}>    </Text>);
  }
  //   <Text style={[styles.text, styles.headline]}>
  //   Waiting for a friend!
  // </Text>
  // <Text style={styles.text}>
  //   To invite someone to play, give this URL
  // </Text>
  // <Text style={[styles.text, styles.urlText]}>
  //   {`${URL_SCHEME}${invitationId}`}
  // </Text>
  // <Text style={styles.text}>
  //   The first person to come to this URL will play with you.
  // </Text>
  renderInvitationMessage() {
    const { invitationId, gameStarted } = this.state;
    if (invitationId && !gameStarted) {
      return (
        <View style={styles.fullScreen}>
          <View style={styles.invitationBox}>

            <Button text={'Share game URL'} onPress={this.share} />
          </View>
        </View>
      );
    }
  }
  // <Clock
  //   time={isReverseBoard ? blackClock : whiteClock}
  //   enabled={isReverseBoard ? blackTurn : whiteTurn}
  // />

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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  invitationBox: {
    backgroundColor: 'white',
    padding: 16,
  },
  text: {
    fontSize: 12,
    marginVertical: 8,
    textAlign: 'center',
  },
  urlText: {
    backgroundColor: 'grey',
    paddingVertical: 16,
    color: 'white',
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 0,
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
