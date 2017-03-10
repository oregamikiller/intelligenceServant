'use strict';
import React, { Component } from 'react';
import {
    Image,
    ListView,
    TouchableHighlight,
    StyleSheet,
    RecyclerViewBackedScrollView,
    Text,
    View,
    AsyncStorage,
    TextInput,
    Modal,
} from 'react-native';

import TabBar from 'react-native-xtabbar';

import {Actions} from 'react-native-router-flux';

export default class MainList extends Component {
    constructor() {
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(['获取数据中...']),
        };
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    fetchData() {
        switch(currentIndex){
            case 0: dataUrl = 'https://semidream.com/trophydata/?platForm=ps4';break;
            case 1: dataUrl = 'https://semidream.com/trophydata/?platForm=ps3';break;
            case 2: dataUrl = 'https://semidream.com/trophydata/?platForm=psvita';break;
            case 3: dataUrl = 'https://semidream.com/trophydata/title/' + 1;break;
            default : dataUrl = 'https://semidream.com/trophydata/title/' + 1;break;
        }
        if (currentIndex === 3) {
            AsyncStorage.getItem('@localStore:' + 'visited', (err, result) => {
                result = result || JSON.stringify([]);
                dataList[currentIndex] = JSON.parse(result).reverse();
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(JSON.parse(result).reverse()),
                    loaded: true,
                });
            });

        } else {
            fetch(dataUrl)
                .then((response) => response.json())
                .then((responseData) => {
                    dataList[currentIndex] = [].concat(responseData);
                    if (responseData.length < 20) { hasMore = false;
                    } else {
                        hasMore = true;
                    }
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(dataList[currentIndex]),
                        loaded: true,
                    });
                }).catch(console.log)
                .done();
        }

    }

    fetchNext() {
        switch(currentIndex){
            case 0: dataUrl = 'https://semidream.com/trophydata/?platForm=ps4&page=';break;
            case 1: dataUrl = 'https://semidream.com/trophydata/?platForm=ps3&page=';break;
            case 2: dataUrl = 'https://semidream.com/trophydata/?platForm=psvita&page=';break;
            case 3: dataUrl = 'https://semidream.com/trophydata/title/' + 1;break;
            default : dataUrl = 'https://semidream.com/trophydata/title/' + 1;break;
        }
        let page = parseInt(this.state.dataSource.getRowCount() / 20) + 1;
        if (requestFinished && hasMore && !searchFlag) {
            requestFinished = false;
            fetch(dataUrl + page)
                .then((response) => response.json())
                .then((responseData) => {
                    requestFinished = true;
                    console.log(responseData.length, responseData);
                    if (responseData.length < 20) { hasMore = false;}
                    dataList[currentIndex] = dataList[currentIndex].concat(responseData);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(dataList[currentIndex]),
                        loaded: true,
                    });

                }).catch(console.log)
                .done();
        }
    }
    getSearchBar() {
        if (currentIndex === 3) {
            return null;
        } else {
            return <TextInput ref = "searchInput"
                           style={styles.searchbox}
                           placeholder="请输入想搜索游戏的标题"
                           returnKeyType="search"
                           keyboardType="default"
                           onChangeText={text => this.SearchTitle(text)}
                           vis
                />;
        }
    }
    render() {
        var self = this;
        return (
            <View style={styles.container}>
                {this.getSearchBar()}
                <TabBar
                    style={styles.content}
                    onItemSelected={(index) => {console.log(`current item's index is ${index}`);
                        currentIndex = index;
                        searchFlag = false;
                        hasMore = false;
                        this.fetchData();
                        self.setState({
                        dataSource: self.state.dataSource.cloneWithRows(dataList[currentIndex]),
                        loaded: true,
                    });
                        }}
                    >
                    <TabBar.Item
                        icon={require('./img/tabbaricon1.jpg')}
                        selectedIcon={require('./img/tabbaricon1.jpg')}
                        onPress={() => {
                }}
                        title='已定制'>
                        <View>
                        <Text>Can I help you</Text>

                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={this._renderRow.bind(this)}
                                enableEmptySections={true}
                                renderSeparator={this._renderSeperator}
                                onEndReached={this.fetchNext.bind(this)}
                                onEndReachedThreshold={20}
                                />
                        </ View>
                    </TabBar.Item>

                    <TabBar.Item
                        icon={require('./img/tabbaricon2.png')}
                        selectedIcon={require('./img/tabbaricon2.png')}
                        onPress={() => {
                    }}
                        title='来挑选'>
                        <View>
                        <Text>挑选想要的功能</Text>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow.bind(this)}
                            enableEmptySections={true}
                            renderSeparator={this._renderSeperator}
                            onEndReached={this.fetchNext.bind(this)}
                            onEndReachedThreshold={20}
                            />
                            </ View>
                    </TabBar.Item>
                    <TabBar.Item
                        icon={require('./img/tabbaricon3.jpg')}
                        selectedIcon={require('./img/tabbaricon3.jpg')}
                        title='发布'>
                        <View>
                        <Text>发</Text>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow.bind(this)}
                            enableEmptySections={true}
                            renderSeparator={this._renderSeperator}
                            onEndReached={this.fetchNext.bind(this)}
                            onEndReachedThreshold={20}
                            />
                        </View>
                    </TabBar.Item>

                    <TabBar.Item
                        icon={require('./img/tabbaricon4.png')}
                        selectedIcon={require('./img/tabbaricon4.png')}
                        title='我的'>
                        <View>
                        <Text></Text>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this._renderRow.bind(this)}
                            enableEmptySections={true}
                            renderSeparator={this._renderSeperator}
                            onEndReached={this.fetchNext.bind(this)}
                            onEndReachedThreshold={20}
                        />
                        </View>
                    </TabBar.Item>
                </TabBar>
            </View>
        );
    }

    _renderRow(rowData:string, sectionID:number, rowID:number) {
        var rowHash = Math.abs(hashCode(rowData));
        if (rowData.pic_url) {
            rowData.desc = '来源: ' + rowData.source;
            rowData.picUrl = rowData.pic_url;
        }
        if (rowData.picUrl === null) {
            rowData.picUrl = 'https://p.pstatp.com/thumb/ca20003cd127d9542be';
        }
        return (
            <TouchableHighlight onPress={ () => this._pressRow(rowID)}>
                <View>
                    <View style={styles.row}>
                        <Image style={styles.thumb} source={{uri:rowData.picUrl.replace('http','https')}}/>
                        <Text style={styles.text}>
                            {rowData.title }{"\n"}{rowData.desc}{"\n"}{rowData.plantForm}
                        </Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    SearchTitle(text) {
        if (text.length >= 1) {
            searchFlag = true;
            dataUrl = 'https://semidream.com/trophydata/title/';
            fetch(dataUrl + text)
                .then((response) => response.json())
                .then((responseData) => {
                    dataList[currentIndex] = responseData;
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(dataList[currentIndex]),
                        loaded: true,
                    });
                }).catch(console.log)
                .done();
        } else {
            searchFlag = false;
            this.fetchData();
        }
    }

    _pressRow(rowID:number) {
        if (currentIndex !== 3 || searchFlag) {
            try {
                let already = false;
                AsyncStorage.getItem('@localStore:' + 'visited', (err, result) => {
                    if(result) {
                        var array = [].concat(JSON.parse(result));
                        array.forEach((item)=> {
                            if(item.id === dataList[currentIndex][rowID].id){
                                already = true;
                            }
                        });
                        if (!already){
                            array.push(dataList[currentIndex][rowID]);
                            AsyncStorage.setItem('@localStore:' + 'visited', JSON.stringify(array)).then(function () {
                                Actions.detail({gameid: dataList[currentIndex][rowID].id});
                            });
                        } else {
                            Actions.detail({gameid: dataList[currentIndex][rowID].id});
                        }
                    } else {
                        result = [];
                        result.push(dataList[currentIndex][rowID]);
                        AsyncStorage.setItem('@localStore:' + 'visited', JSON.stringify(result)).then(function () {
                            Actions.detail({gameid: dataList[currentIndex][rowID].id});
                        });
                    }

                });
            } catch (error) {
                console.log(error);
            }
        } else {
            Actions.detail({gameid: dataList[currentIndex][rowID].id});
        }

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
}

var dataList0 = [];
var dataList1 = [];
var dataList2 = [];
var dataList3 = [];
var dataUrl = '';
var dataList = [dataList0, dataList1, dataList2, dataList3]
var hasMore= true;
var searchFlag = false;
var requestFinished = true;
var currentIndex = 0;
var showSearch = false;

var hashCode = function (str) {
    var hash = 15;
    for (var ii = str.length - 1; ii >= 0; ii--) {
        hash = ((hash << 5) - hash) + str.charCodeAt(ii);
    }
    return hash;
};

var styles = StyleSheet.create({
    container: {
        marginTop: 55,
        flex: 1,
        flexDirection: 'column',
    },
    searchbox: {
        padding: 3,
        fontSize: 20,
        borderColor: 'red',
        borderWidth: 1,
        height: 30,
        paddingLeft: 8,
        flexDirection: 'row',
    },
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
        width: 100,
        height: 55,
        margin: 5,
    },
    text: {
        margin: 5,
        flex: 1,
    },
});
