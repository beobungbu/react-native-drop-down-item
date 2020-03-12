import React, { Component } from 'react';

import {
  TouchableOpacity,
  Image,
  Text,
  View,
  StyleSheet,
  InteractionManager,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';

import {IconUp, IconNextSmall} from '../../src/styles/svg';

import PropTypes from 'prop-types';

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  icons: {
    width: 20,
    height: 20,
    position: 'absolute',
    right: 16,
  },
  underline: {
    width: '100%',
    height: 1,
    position: 'absolute',
    top: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contentChild: {
    padding: 12,
  },
  contentView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  contentTxt: {
    color: 'black',
    marginLeft: 8,
    fontSize: 12,
  },
  contentFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
  },
});

class Item extends Component {
  static animated;
  static defaultProps = {
    contentVisible: false,
    backgroundColor: 'transparent',
    titleBackground: 'transparent',
    contentBackground: 'transparent',
    underlineColor: '#d3d3d3',
    visibleImage: false,
    invisibleImage: false,
  };

  static propTypes = {
    contentVisible: PropTypes.bool,
    backgroundColor: PropTypes.string,
    titleBackground: PropTypes.string,
    contentBackground: PropTypes.string,
    underlineColor: PropTypes.string,
    visibleImage: PropTypes.any,
    invisibleImage: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      isMounted: false,
      contentVisible: props.contentVisible,
      headerheight: 0,
      contentHeight: 0,
    };
  }

  render() {
    return (
      <Animated.ScrollView style={[
        styles.container,
        {
          height: this.animated,
          backgroundColor: this.props.backgroundColor,
          marginBottom: width*0.04,
          // paddingTop: 30
        },
        this.props.style,
      ]} scrollEnabled={this.state.contentVisible}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={this.onPress}
        >
          <View
            onLayout={ this.onAnimLayout }
            style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: width*0.045}}
          >
            { this.props.header }
            {!this.state.contentVisible
              ? <IconNextSmall />
              : <IconUp />}
          </View>
        </TouchableOpacity>
        <View
          style={styles.content}
          onLayout={this.onLayout}
        >
          <View
            style={[
              styles.contentChild, {marginTop: width*0.04}
            ]}
          >
            { this.props.children }
          </View>
        </View>
      </Animated.ScrollView>
    );
  }

  runAnimation = () => {
    const initialValue = this.state.contentVisible
      ? this.state.headerHeight + this.state.contentHeight : this.state.headerHeight;
    const finalValue = this.state.contentVisible
      ? this.state.headerHeight : this.state.contentHeight + this.state.headerHeight;

    this.setState({
      contentVisible: !this.state.contentVisible,
    });

    this.animated.setValue(initialValue);
    Animated.spring(
      this.animated,
      {
        toValue: finalValue,
      },
    ).start();
  }

  onAnimLayout = (evt) => {
    const headerHeight = evt.nativeEvent.layout.height;
    if (!this.state.isMounted && !this.props.contentVisible) {
      this.animated = new Animated.Value(headerHeight);
      this.setState({
        isMounted: true,
        headerHeight,
      });
      return;
    } else if (!this.state.isMounted) {
      InteractionManager.runAfterInteractions(() => {
        this.animated = new Animated.Value(headerHeight + this.state.contentHeight);
      });
    }
    this.setState({ headerHeight, isMounted: true });
  }

  onLayout = (evt) => {
    const contentHeight = evt.nativeEvent.layout.height;
    this.setState({ contentHeight });
  }

  onPress = () => {
    this.runAnimation();
  }
}

export default Item;
