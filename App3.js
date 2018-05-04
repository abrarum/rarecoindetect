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

/* const landmarkSize = 2;

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
}; */



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
    buttono: 'SNAP'
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

  /* componentWillUpdate(){
    this.loadMe();
  } */

  /* getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleView() {
    this.setState({
      showGallery: !this.state.showGallery,
    });
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  setRatio(ratio) {
    this.setState({
      ratio,
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  } */

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
        result()
      });
      });
    }
  }

   loadMe(){
    if (this.state.loading == true) {
      return <Spinner size="small" />;
    }
    else if(this.state.loading == false){
      return (<Text style={{fontSize: 22, marginLeft:5, marginRight: 5, textAlign: 'center'}}>Please take a close snap of your coin.</Text>);
    }
    else if(this.state.loading == null){
      if(this.state.getAll2 > 0.8)
      return <Text style={{fontSize: 22, marginLeft:5, marginRight: 5, textAlign: 'center'}}>We detected a rare {this.state.getAll} coin with an accuracy of '{this.state.getAll2*100}' </Text>;
    } 
    else{
      return <Text style={{fontSize: 22, marginLeft:5, marginRight: 5, textAlign: 'center'}}> Sorry, but we didn't detect a rare coin. </Text>;
    }
  }

  /* onFacesDetected = ({ faces }) => this.setState({ faces });
  onFaceDetectionError = state => console.warn('Faces detection error:', state);

  renderGallery() {
    return <GalleryScreen onPress={this.toggleView.bind(this)} />;
  } */

  /* renderFace({ bounds, faceID, rollAngle, yawAngle }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}>
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  }

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderFace)}
      </View>
    );
  }

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderLandmarksOfFace)}
      </View>
    );
  } */

  renderNoPermissions() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 }}>
        <Text style={{ color: 'white' }}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    );
  }

 /* componentDidUpdate() {
   updater().then(getAll => {
     if(getAll){
      this.setState({ getAll: getAll.name, getAll2: getAll.value })
     }
     else{
      this.setState({ getAll: <Text>Failed Operation</Text> })
     }
    });
   }  */

  /* renderText() {
  switch (this.state.getAll.lenth > 0) {
      case true: 
          return (
            <Text style={{fontSize: 22, marginLeft:5, marginRight: 5, textAlign: 'center'}}>We detected a rare {getAll} coin with an accuracy of '{getAll2*100}' </Text>
      );
      case false:
          return (<Text>Please take a close snap of your coin.</Text>);
      default:
          return (<Spinner size="large" />);
  }
} */

  renderCamera() {
    const { getAll, getAll2 } = this.state;
    //console.log(this.getCoinDetails);
    return (
      <Camera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        faceDetectionLandmarks={Camera.Constants.FaceDetection.Landmarks.all}
        onFacesDetected={this.onFacesDetected}
        onFaceDetectionError={this.onFaceDetectionError}
        focusDepth={this.state.depth}>
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
        {this.renderFaces()}
        {this.renderLandmarks()}
      </Camera>
    );
  }

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    /* const content = this.state.showGallery ? this.renderGallery() : cameraScreenContent; */
    return <View style={styles.container}>{content}</View>;
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
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  galleryButton: {
    backgroundColor: 'indianred',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
});