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
    Button,
    TextInput,
} from 'react-native';

import Config from './Config.js'

export default class MyHomeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            loginName: null,
            password: null,
            isFinishInit: false
        };
    }

    componentWillMount() {
        this.getUserStatus().done();
    }

    async getUserStatus() {
        let user = await AsyncStorage.getItem('@localStore:' + 'user');
            if (user) {
                let userJSON = JSON.parse(user);
                this.setState({
                    user: userJSON.id,
                    token: userJSON.token
                });
            }
        this.setState({
            isFinishInit: true,
        })
        }


    getTask() {
        fetch('https://semidream.com/trophydetail/' + gameid)
            .then((response) => response.json())
            .then((responseData) => {
                self.setState({
                    dataSource: this.state.dataSource.cloneWithRows(responseData),
                    loaded: true,
                });
            })
            .done();
    }

    renderUser() {
        if (this.state.user) {
            return <View style={{marginTop: 55}}>
                <Text>{this.state.user}</Text>
            </View>
        }
        else {
            return <View style={{marginTop: 55,
        padding: 5,
        backgroundColor: '#F6F6F6', flexDirection: 'column'}}>
                <View style={styles.inputRow}>
                    <Text>用户名:</Text>
                    <TextInput style={styles.input} ref="loginName" placeholder="请输入用户名"
                               keyboardType="default"
                               onChangeText={(text) => this.setState({loginName: text})}
                               value={this.state.loginName}/>

                </ View>
                <View style={styles.inputRow}>
                    <Text>密码:</Text>
                    <TextInput style={styles.input} ref='password' placeholder='请输入密码'
                               keyboardType="default"
                               onChangeText={(text) => this.setState({password: text})}
                               value={this.state.password}/>
                </ View>
                <Button
                    onPress={() => {console.log(this.state, Config.authUrl);
                        fetch(Config.authUrl + '?' + 'userID=' + this.state.loginName + '&password=' + this.state.password)
                        .then((response) => response.json())
                        .then((responseJson) => {
                            console.dir(responseJson);
                            if (responseJson.msg === 'ok') {
                                let user = {id: this.state.loginName, token: responseJson.token};
                                AsyncStorage.setItem('@localStore:' + 'user', JSON.stringify(user)).then(function () {
                                console.log('login success');
                                }
                            );

                            }
                          });
                    }}
                    title="注册或登录"
                    color="#841584"
                    />
            </View>
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

        if (this.state.isFinishInit) {
            return (
                <View>
                    {this.renderUser()}

                </View>
            );
        } else {
            return (
                <View>


                </View>
            );
        }

    }

    _renderRow(rowData:string, sectionID:number, rowID:number) {
        var rowHash = Math.abs(hashCode(rowData));
        var des     = rowData.desc.split('|');
        if (des.length > 1) {
            rowData.desc    = des[0];
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
        if (Platform.OS === 'ios') {
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

    inputRow: {
        padding: 5,
        margin: 5,
        backgroundColor: '#CCC',
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
    input: {
        height: 40,
        fontSize: 14
    }
});
