import React, { Component } from 'react';
import { WebView, BackAndroid } from 'react-native';



var targetUrl = false;
var DEFAULTUrl = 'https://semidream.com';

export default class CustomWebView extends Component {
    componentDidMount () {
    var self = this;
    BackAndroid.addEventListener('hardwareBackPress', function () {
        if (self.props.navigator.getCurrentRoutes().length > 1) {
            self.props.navigator.pop();
            return true;
        } else {
            return false;
        }
    });
    }
    render() {
        return (
            <WebView
                source={{uri: this.props.targetUrl||DEFAULTUrl}}
                style={{marginTop: 20}}
                />
        );
    }
}