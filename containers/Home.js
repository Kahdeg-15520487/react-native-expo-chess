import React, { Component } from 'react';
import {
  ActivityIndicator,
  Slider,
  Text,
  Linking,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  NetInfo 
} from 'react-native';

import Modal from 'react-native-modalbox';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { Chess } from 'chess.js';

import { Button, Board } from '../components';

const Constant = require('./Constant.js');

const HTTP_BASE_URL = 'https://en.lichess.org';
const COLORS = ['white', 'random', 'black'];

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Home',
  };

  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      modalDisplayed: false,
      selectedColorIndex: 1,
      selectedTimeIndex: 0,
      totalMinutes: 5,
      incrementSeconds: 8,
      aiLevel: 3,
      playVsAI: false,
      puzzleFen: 'wrong',
      puzzleColor: 'w',
      fen: Constant.defaultfen
    };
  }

  componentDidMount() {
    var isOnline = true;
    NetInfo.isConnected.fetch().then(isConnected => {
      isOnline = isConnected;
      if(isConnected)
      {
        console.log('Internet is connected');
      }
    })

    if(isOnline){
      Linking.getInitialURL().then(url => {
        if (url) {
          this.handleOpenURL(url);
        }
      });

      Linking.addEventListener('url', event => this.handleOpenURL(event.url));
      // sets session cookie
      fetch(`${HTTP_BASE_URL}/account/info`).then(this.getDailyPuzzle);
    }
  }

  getDailyPuzzle = (res) => {
    console.log("geting daily puzzle");
    fetch(`${HTTP_BASE_URL}/training/daily`, {
      headers: {
        Accept: 'application/vnd.lichess.v3+json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
      .then(res => res.json())
      .then(res => {
        const { id, fen, color, initialMove, lines } = res.puzzle;

        this.setState({
          puzzleColor: color === 'white' ? 'w' : 'b',
          puzzleFen: fen,
          puzzleData: res.puzzle,
          ready: true,
        });
      });
  };

  handleOpenURL(url) {
    const { navigate } = this.props.navigation;
    const {
      selectedColorIndex,
      selectedTimeIndex,
      modalDisplayed,
      totalMinutes,
      incrementSeconds,
      aiLevel,
      playVsAI,
    } = this.state;
    console.log("url: "+url);
    const fen = url.replace('lichess599://', '');
    const playConfig = JSON.stringify({
      variant: 1,
      timeMode: selectedTimeIndex,
      days: '2',
      time: `${totalMinutes}`,
      increment: `${incrementSeconds}`,
      level: `${aiLevel}`,
      color: COLORS[selectedColorIndex],
      fen: fen.includes('://')? Constant.defaultfen:fen,
    });
    navigate('PlayerVsFriend', { config: playConfig });
  }

  displayModal(playVsAI) {
    this.setState({
      modalDisplayed: true,
      playVsAI,
    });
  }

  create = () => {
    const { navigate } = this.props.navigation;
    const {
      selectedColorIndex,
      selectedTimeIndex,
      modalDisplayed,
      totalMinutes,
      incrementSeconds,
      aiLevel,
      playVsAI,
      fen,
    } = this.state;
    const playConfig = JSON.stringify({
      variant: 1,
      timeMode: selectedTimeIndex,
      days: '2',
      time: `${totalMinutes}`,
      increment: `${incrementSeconds}`,
      level: `${aiLevel}`,
      color: COLORS[selectedColorIndex],
      fen: fen,
    });
    console.log("home: "+playConfig);
    if (playVsAI) {
      navigate('PlayerVsAI', {
        config: playConfig,
        time: selectedTimeIndex === 1 ? totalMinutes * 60 : -1,
      });
    } else {
      navigate('PlayerVsFriend', {
        config: playConfig,
        time: selectedTimeIndex === 1 ? totalMinutes * 60 : -1,
      });
    }

    this.setState({ modalDisplayed: false });
  };

  renderModal() {
    const {
      selectedColorIndex,
      selectedTimeIndex,
      modalDisplayed,
      totalMinutes,
      incrementSeconds,
      aiLevel,
      playVsAI,
      fen,
    } = this.state;

    let fenTextBox = (
        <View>
          <Text style={styles.label}>FEN string</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) =>{console.log(text); this.setState({fen: text})}}
            value={fen}
          />
        </View>
      );

    return (
      <Modal isOpen={modalDisplayed} backdropOpacity={0.8} style={styles.modal}
      onClosed={()=>this.setState({modalDisplayed: false})}>
        <View style={styles.modalContent}>
          {fenTextBox}
          <Button
            style={styles.modalButton}
            text={'Create'}
            onPress={this.create}
          />
        </View>
      </Modal>
    );
  }

  renderPuzzleBoard() {
    const { navigate } = this.props.navigation;
    const { puzzleColor, puzzleFen, puzzleData } = this.state;
    const {
      selectedColorIndex,
      selectedTimeIndex,
      modalDisplayed,
      totalMinutes,
      incrementSeconds,
      aiLevel,
      playVsAI,
      fen,
    } = this.state;
    const playConfig = JSON.stringify({
      variant: 1,
      timeMode: selectedTimeIndex,
      days: '2',
      time: `${totalMinutes}`,
      increment: `${incrementSeconds}`,
      level: `${aiLevel}`,
      color: COLORS[selectedColorIndex],
      fen: puzzleFen,
    });

    return (
      <View style={styles.puzzleContainer}>
        <Text style={styles.puzzleHeadline}>Puzzle of the day</Text>
        <TouchableOpacity onPress={() => navigate('PlayerVsFriend', { config: playConfig })}>
          <Board
            style={styles.board}
            size={200}
            color={puzzleColor}
            fen={puzzleFen}
            shouldSelectPiece={() => false}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderActivityIndicator() {
    if (this.state.ready) {
      return null;
    }

    return (
      <View style={styles.loadingContanier}>
        <ActivityIndicator animation size={'large'} color={'green'} />
      </View>
    );
  }

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        {this.renderPuzzleBoard()}
        <Button
          style={styles.button}
          text={'Play with the machine'}
          onPress={() => this.displayModal(true)}
        />
        <Button
          style={styles.button}
          text={'Play with a friend'}
          onPress={() => this.displayModal(false)}
        />
        {this.renderModal()}
        {this.renderActivityIndicator()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 32,
  },
  button: {
    marginTop: 16,
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: '#D85000',
  },
  modal: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    padding: 4,
  },
  clockContainer: {
    backgroundColor: '#81a59a',
    padding: 16,
    marginTop: 16,
  },
  board: {
    alignSelf: 'center',
  },
  puzzleContainer: {
    alignSelf: 'center',
  },
  puzzleHeadline: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    margin: 4,
  },
  loadingContanier: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: 24,
    opacity: 0.4,
  },
});
