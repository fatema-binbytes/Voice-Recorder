import React, { Component } from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ListView,
  ToastAndroid
 } from "react-native";
import RNFS from 'react-native-fs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { RNVoiceRecorder } from './RNVoiceRecorder'
import Utils from './fileName'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.data=[]
    this.state = {
      visible: false,
      view:false,
      data:this.data,
      dataSource: this.ds.cloneWithRows(this.data),
    }
  }
  componentDidMount(){
  this.list()
  }
  list(){
    this.setState({view:true})
     let a=[]
      RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/Record/') 
      .then((result) => {
      result.forEach((x) => { 
      if( x.path.includes('wav')){
        a.push({name:x.name,path:x.path})
        }
      })
    this.setState({data:a,dataSource: this.ds.cloneWithRows(a)})
    })
  }
  _onRecord() {
     RNVoiceRecorder.Record({
      format: 'wav',
      onDone: (path) => {
         var destPath = RNFS.ExternalStorageDirectoryPath + '/Record/' + Utils.getFileName()+'.wav'
          RNFS.moveFile(path, destPath).then(this.list())
         .catch((err) => {
          console.log("Error: " + err.message);
         })
        },
        onCancel: () => {
          ToastAndroid.show('Cancle Reacording !',ToastAndroid.SHORT)
          }
        });
      }

  _onPlay(path) {
    RNVoiceRecorder.Play({
      path: path ,
      format: "wav",
      onDone: path => {
        console.log("play done: " + path);
      },
      onCancel: () => {
        console.log("play cancelled");
      }
    });
  }
   _delete(id) {
    RNFS.unlink(path)
    this.state.data.splice(id,1)
    console.log(id,this.state.data)
    this.setState({data:this.state.data,dataSource: this.ds.cloneWithRows(this.state.data)})
   }
  render() {
    return(
      <View style={{ 
        flex: 1,
        justifyContent:'center'}}>
        <View style={{
          justifyContent:'center',
          flexDirection:'row',
          padding:10,
          backgroundColor:'#DC143C'
          }}>
            <View style={{
              flex:1,
              flexDirection:'row',
              alignItems:'center'}}>
              <Icon name={'playlist-music'} size={30} color={'#FFF'}/>
              <View style={{
                flex:1,
                marginLeft:50,
                alignItems:'center',
                justifyContent:'flex-end'}}>

                <Text style={{
                textAlign:'center',
                fontSize:20,
                color:'#FFF'}}>
                Record
                </Text>
                
              </View>
            </View>
        
            <View style={{flex:0.5,justifyContent:'flex-end',alignItems:'flex-end'}} >
              <TouchableOpacity onPress={() => { this._onRecord()}} >
                  <Icon name={'microphone-plus'} size={25} color="#FFF"/>
              </TouchableOpacity>
            </View>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData,rowID,selectionData) => {
          return(
          <View style={{
            borderBottomWidth:1,
              borderColor:'lightgrey',
              flex:1,
              padding:5,
              marginHorizontal:5,
              justifyContent:'center',
            flexDirection:'row'
            }}>
            <TouchableOpacity style={{
              margin:3,
              flexDirection:'row',
              flex:1,
              alignItems:'center' }}
              onPress={() => {this._onPlay(rowData.path)}}>
                
                <View style={{flex:0.2}}>
                  <Icon name={'play-circle'} size={30} color={'#DC143C'}/>
                </View>
                <View style={{flex:1}}>
                    <Text style={{margin:10,marginLeft:0,color:'#000'}}>{rowData.name}</Text>
              </View>
            </TouchableOpacity>
              <View style={{flex:0.2,
                justifyContent:'center',
                alignItems:'flex-end'}}>
                <TouchableOpacity style={{margin:3 }}
                  onPress={() => {this._delete(selectionData)}} >
                  <Icon name={'delete'} size={20} color={'#00000066'}/>
                </TouchableOpacity>
              </View>
          </View>
          )}}
          enableEmptySections={true}/>
    </View>
    )
  }
}

