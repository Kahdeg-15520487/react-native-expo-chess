import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const TOTAL_MINUTES = 60;
//const lowTimeSound = new Expo.Audio.Sound();

export default class Clock extends Component {
  static propTypes = {
    time: PropTypes.number.isRequired,
    enabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      time: props.time,
    };
  }

  getNavigationParams() {
    return this.props.navigation.state.params || {}
  }

  componentDidUpdate(nextProps) {
    const nextTime = nextProps.time;
    if (this.props.time !== nextTime) {
      this.setState({
        time: nextTime,
      });
    }
  }

  _loadInitialState = async () => {
    // try {
    //   await lowTimeSound.loadAsync(require('../assets/sounds/lowtime.mp3'));
    // } catch (error) {
    //   // An error occurred!
    // }
  };

  componentDidMount = () => {
    this._loadInitialState().done();
    this.intervalId = setInterval(
      async () => {
        if (this.props.enabled) {
          const { time } = this.state;
          const playDong = time === 59;

          if (playDong) {
            //await lowTimeSound.playAsync();
          }

          if (time > 0) {
            this.setState({
              time: time - 1,
            });
          }
        }
      },
      1000,
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { enabled } = this.props;
    const { time } = this.state;
    if (time < 0) {
      return (
        <Text style={styles.waiting}>
          {enabled ? 'Waiting for player!' : ' '}
        </Text>
      );
    }

    let minutes = '' +
      Math.floor(time % (TOTAL_MINUTES * TOTAL_MINUTES) / TOTAL_MINUTES);
    let seconds = '' + Math.floor(time % TOTAL_MINUTES);

    if (isNaN(minutes) || isNaN(seconds)) {
      return null;
    }

    if (minutes.length === 1) {
      minutes = `0${minutes}`;
    }
    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }
//<Text style={styles.text}>{`${minutes}:${seconds}`}</Text>
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    alignSelf: 'flex-end',
    backgroundColor: 'grey',
    padding: 4,
    borderRadius: 3,
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  waiting: {
    margin: 16,
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#dd465b',
  },
});
