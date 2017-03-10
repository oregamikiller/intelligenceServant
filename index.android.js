import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {Router} from 'react-native-router-flux';
var scenes = require('./Routes');

export default class intelligenceServant extends Component {

    render() {
        return <Router scenes={scenes} />

    }
}

AppRegistry.registerComponent('intelligenceServant', () => intelligenceServant);
