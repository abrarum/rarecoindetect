import { Constants, Camera, FileSystem, Permissions } from 'expo';
import React from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Slider, Vibration } from 'react-native';
import GalleryScreen from './GalleryScreen';
import isIPhoneX from 'react-native-is-iphonex';
import Clarifai from 'clarifai';
import { resolve } from 'url';
import Spinner from './Spinner';

process.nextTick = setImmediate;

const ClarifaiApp = new Clarifai.App({
  apiKey: 'f4650648f3b1455fbdab7d06569a8268'
 });

 function updater(linkNamer){
  return ClarifaiApp.models.predict("coiner app", {base64: linkNamer}).then(
    function(response){
      par1 = response['outputs'][0]['data']['concepts'][0];
      console.log(par1);
      return(par1);
    });
 }

export default class CameraScreen extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    ratios: [],
    photoId: 1,
    showGallery: false,
    photos: [],
    faces: [],
    permissionsGranted: false,
    getAll: '',
    loading: false,
    success: null,
    funda: false,
    buttono: 'SNAP',
    refresher: true,
    fullo: true
  };


  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === 'granted' });

  }

  componentDidMount() {
    FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'photos').catch(e => {
      console.log(e, 'Directory exists');
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function() {
    this.setState({ loading: true })
    if (this.camera) {
      this.camera.takePictureAsync({ base64: true }).then(data => {
        console.log('data: ', data.base64);
        
        updater(data.base64).then(getAll => { this.setState({ getAll: getAll.name, getAll2: getAll.value })
        this.setState({ loading: null })
      });
      });
    }
  }

   loadMe(){
    if (this.state.loading == true) {
      return <Spinner size="small" />;
    }
    else if(this.state.loading == false || this.state.fullo == false){
      return (<Text style={{fontSize: 22, marginLeft:5, marginRight: 5, textAlign: 'center'}}>Please take a close snap of your coin.</Text>);
    }
    else if(this.state.loading == null){
      if(this.state.getAll2 > 0.8){
      return (
        <View>
        <Text style={{fontSize: 22, marginLeft:5, marginRight: 5, textAlign: 'center'}}>We detected a rare {this.state.getAll} coin with an accuracy of '{this.state.getAll2*100}' </Text>
        
        </View>
    );
    } 
    else{
      return(
      <View>
        <Text style={{fontSize: 22, marginLeft:5, marginRight: 5, textAlign: 'center'}}> Sorry, but we didn't detect a rare coin. </Text>
      </View>
      );
    }
  }
}

  renderNoPermissions() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <Text style={{ color: 'white' }}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    );
  }

  renderCamera() {
    //const { getAll, getAll2 } = this.state;
    //console.log(this.getCoinDetails);
    return (
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        
        >
        <View
          style={{
            flex: 0.5,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingTop: Constants.statusBarHeight / 2,
          }}>
        </View>
        
        <View
          style={{
            flex: 0.4,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginBottom: -5,
          }}>
         
        {this.loadMe()}

        </View>
        <View
          style={{
            flex: 0.1,
            paddingBottom: isIPhoneX ? 20 : 0,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}>
          
          <TouchableOpacity
            style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: 'flex-end' }]}
            onPress={this.takePicture.bind(this)}>
            <Text style={styles.flipText}> {this.state.buttono} </Text>
          </TouchableOpacity>
          
        
        </View>
        
      </Camera>
    );
  }

  render() {
    if(this.state.refresher){
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
     const content = this.state.showGallery ? this.renderGallery() : cameraScreenContent; 
    return <View key={this.state.refresher} style={styles.container}>{content}</View>;
  }
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  navigation: {
    flex: 1,
  },
  item: {
    margin: 4,
    backgroundColor: 'indianred',
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  row: {
    flexDirection: 'row',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  }
});