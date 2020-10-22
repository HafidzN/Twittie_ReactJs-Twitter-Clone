import React ,{ PureComponent } from 'react'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import './CropPhoto.css'

import Slider from '../../elements/Slider/Slider'
import Crop169Icon from '@material-ui/icons/Crop169'
import Crop32Icon from '@material-ui/icons/Crop32'
import CropPortraitIcon from '@material-ui/icons/CropPortrait'


class CreatePost extends PureComponent {
  state = {
    src: null,
    crop: {
      unit: '%',
      width: 30,
      aspect: this.props.initialAspectRatio || 3/4,
    },
    originalImageSize : null,
    croppedImageUrl: null, 
    zoomScale: 1
  }

  onImageLoaded = image => {
      this.imageRef = image
  }

  onCropChange = (crop) => {
      this.setState({ crop })
  }

  onCropComplete = async crop => {
      if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.getCroppedImg(this.imageRef, crop)
          this.setState({ croppedImageUrl })
      }
  }



  getCroppedImg(image, crop) {
      const canvas = document.createElement("canvas")
      const scaleX = image.naturalWidth / image.width
      const scaleY = image.naturalHeight / image.height
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext("2d")
      
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

      const reader = new FileReader()
      canvas.toBlob(blob => {
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
              this.dataURLtoFile(reader.result, 'cropped.jpg')
          }
      })
  }

  dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?)/)[1],
          bstr = atob(arr[1]), 
          n = bstr.length, 
          u8arr = new Uint8Array(n)
              
      while(n--){
          u8arr[n] = bstr.charCodeAt(n)
      }
      let croppedImage = new File([u8arr], filename, {type:mime})
      this.setState({croppedImage: croppedImage }) 
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


  componentDidUpdate (prevProps, prevState ){
      if(prevState.croppedImage !== this.state.croppedImage){
        this.props.setCroppedImageResult(this.state.croppedImage)
      }

      if (prevState.zoomScale !== this.state.zoomScale){
        const  newScale = 1+ (3-1)/(100-1)*(this.state.zoomScale - 1)
        document.querySelector('.cropImage__wrapper .ReactCrop__image').style.transform = `scale(${newScale})`
      }

  }


  render() {
    const { crop,  src, originalImageSize} = this.state

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
                style={{
                  width: '100vh',
                }}
              />
            )}


        {
            src && (
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
      </div>
    )
  }
}


export default CreatePost


