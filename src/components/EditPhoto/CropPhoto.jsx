import React, { PureComponent } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import Slider from '../../elements/Slider/Slider'

import Crop169Icon from '@material-ui/icons/Crop169'
import Crop32Icon from '@material-ui/icons/Crop32'
import CropPortraitIcon from '@material-ui/icons/CropPortrait'

import './CropPhoto.css'



export default class App extends PureComponent {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: this.props.initialAspectRatio || 3/4
    },
    originalImageSize : null,
    zoomScale: 1
  }

  onImageLoaded = image => {
    this.imageRef = image
  }

  onCropComplete = crop => {
    this.makeClientCrop(crop)
  }

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop })
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        'newFile.jpeg'
      )
      this.setState({ croppedImageUrl })
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'))
          console.error('Canvas is empty')
          return
        }
        blob.name = fileName
        window.URL.revokeObjectURL(this.fileUrl)
        this.fileUrl = window.URL.createObjectURL(blob)
        resolve(this.fileUrl)
      }, 'image/jpeg')
    })
  }
  


  onChangeAspectRatio = (num) =>{
      this.setState({crop: {
          ...this.state.crop,
          aspect: num
      }})
  }

  onChangeZoomScale = (val) => {
    this.setState({zoomScale: val})
  }


  componentDidMount (){
      const {image, initialAspectRatio} = this.props
      this.setState({src: image, originalImageSize: initialAspectRatio})
  }

  componentDidUpdate(prevProps, prevState){
      if (prevState.zoomScale !== this.state.zoomScale){
        const  newScale = 1+ (3-1)/(100-1)*(this.state.zoomScale - 1)
        document.querySelector('.cropImage__wrapper .ReactCrop__image').style.transform = `scale(${newScale})`
      }

      if(prevState.croppedImageUrl !== this.state.croppedImageUrl){
        this.props.setCroppedImageResult(this.state.croppedImageUrl)
      }

  }


  render() {
    const { crop, croppedImageUrl, src , originalImageSize} = this.state

    return (
      <div className="cropImage__wrapper">
        <div className="cropImage__imageSelection">
            {src && (
              <ReactCrop
                src={src}
                crop={crop}
                ruleOfThirds
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
                onChange={this.onCropChange}
              />
            )}        
        </div>

        {
            croppedImageUrl && (
                <div className="cropImage__changeAspectRatio-actions">
                   <div className="cropImage__scaleButton">
                      <div onClick={()=>this.onChangeAspectRatio(originalImageSize)}  className={`${crop.aspect ===   originalImageSize &&  'blued'}`}><CropPortraitIcon /></div>
                      <div onClick={()=>this.onChangeAspectRatio(16/9)} className={`${crop.aspect === 16/9 && 'blued'}`}><Crop169Icon /></div>
                      <div onClick={()=>this.onChangeAspectRatio(1/1)}  className={`${crop.aspect === 1 &&    'blued'}`}><Crop32Icon /></div>
                   </div>
                   <div className="cropImage__slider">
                      <Slider val={this.state.zoomScale} setVal={this.onChangeZoomScale}/>
                   </div>
                </div>
            )
        }
      </div>
    )
  }
}