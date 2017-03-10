import React, { Component } from 'react';
import {
        Image,
        ListView,
        TouchableHighlight,
        StyleSheet,
        RecyclerViewBackedScrollView,
        Text,
        View,
        Platform,
        AsyncStorage,
        } from 'react-native';

export default class MyHomeView extends Component {
    constructor(props) {
        super(props);
        gameid = props.gameid;
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            user: null
        };
    }

    constructor(props) {
        super(props);
        gameid = props.gameid;

    }

    getUser() {
        AsyncStorage.getItem('@localStore:' + 'user').then(function (user) {
            this.setState({
                user: user
            });
        });
    }

    getTask() {
        fetch('https://semidream.com/trophydetail/' + gameid)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true,
                });
            })
            .done();
    }

    componentDidMount() {
        this.fetchData();
        this.getUser();
    }

    renderUser() {
        if (this.state.user) {
            return <View></ View>;
        }
        else {
                return <View></ View>;
            }
    }

    renderTask() {

    }

    fetchData() {
        fetch('https://semidream.com/trophydetail/' + gameid)
            .then((response) => response.json())
            .then((responseData) => {
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true,
                });
            })
            .done();
    }

    render() {
        return (

            <ListView style={{marginTop: 55}}
                dataSource={this.state.dataSource}
                enableEmptySections={true}
                renderRow={this._renderRow}
                renderSeparator={this._renderSeperator}
                />
        );
    }

    _renderRow(rowData:string, sectionID:number, rowID:number) {
        var rowHash = Math.abs(hashCode(rowData));
        var des = rowData.desc.split('|');
        if (des.length > 1) {
            rowData.desc = des[0];
            rowData.descCHN = des[1];
        }
        return (
            <TouchableHighlight>
                <View>
                    <View style={styles.row}>
                        <Image style={styles.thumb} source={{uri:rowData.picUrl}}/>
                        <Text style={styles.text}>
                             {rowData.title }{"\n"}{rowData.desc}{"\n"}{rowData.descCHN}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    _renderSeperator(sectionID:number, rowID:number, adjacentRowHighlighted:bool) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
        }}
                />
        );
    }

    pressRow(rowID:number) {
        if (Platform.OS === 'ios')  {
            this.props.navigator.pop();
        } else {
            this.props.navigator.pop();
            //NativeAndroidActivityLoader.startActivityByString('com.generalapp.AdActivity');
        }

}


};
var gameid;

var hashCode = function (str) {
    var hash = 15;
    for (var ii = str.length - 1; ii >= 0; ii--) {
        hash = ((hash << 5) - hash) + str.charCodeAt(ii);
    }
    return hash;
};

var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: '#F6F6F6',
    },
    separator: {
        height: 1,
        backgroundColor: '#CCCCCC',
    },
    thumb: {
        width: 54,
        height: 54,
        margin: 5,
    },
    text: {
        margin: 5,
        flex: 1,
    },
});
