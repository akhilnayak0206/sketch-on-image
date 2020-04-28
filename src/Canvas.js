import React from 'react';
import { Layer, Rect, Stage, Image } from 'react-konva';
import useImage from 'use-image';
import './Canvas.css';

const UrlImage = ({ src }) => {
  const [image] = useImage(src);
  return (
    <Image
      image={image}
      x={100}
      y={100}
      width={window.innerWidth / 1.5}
      height={window.innerHeight / 1.5}
    />
  );
};

class MyRect extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      color: 'green',
      rectData: [],
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      drag: false,
      srcImage: '',
    };
  }

  addMouseEvents = () => {
    document.addEventListener('mousedown', this.onMouseDown, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  };
  removeMouseEvents = () => {
    document.removeEventListener('mousedown', this.onMouseDown, false);
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
  };

  onMouseDown = (e) => {
    this.setState({
      drag: true,
      startX: e.pageX,
      startY: e.pageY,
    });
  };

  onMouseMove = (e) => {
    if (this.state.drag) {
      this.setState((prevState) => ({
        endX: e.pageX - prevState.startX,
        endY: e.pageY - prevState.startY,
      }));
    }
  };

  onMouseUp = (e) => {
    let obj = {};
    obj.x = this.state.startX;
    obj.y = this.state.startY;
    obj.w = this.state.endX;
    obj.h = this.state.endY;
    this.setState((prevState) => ({
      rectData: [...prevState.rectData, obj],
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      drag: false,
    }));
  };

  onUndo = () => {
    let arrNew = this.state.rectData;
    let rectData = arrNew.slice(0, -2);
    this.setState({
      rectData,
    });
  };

  onLoadImage = () => {
    let srcImage = prompt(
      'Please enter the image url:',
      'https://dummyimage.com/600x400/000/fff'
    );
    // eslint-disable-next-line eqeqeq
    if (srcImage == null || srcImage == '') {
      alert('Image not added!');
    } else {
      this.setState({
        srcImage,
      });
    }
  };

  onRestore = () => {
    let rectData = localStorage.getItem('rectData');
    let srcImage = localStorage.getItem('srcImage');
    if (rectData) {
      this.setState({
        rectData: JSON.parse(rectData),
        srcImage: '',
      });
    }
    if (srcImage) {
      this.setState({
        srcImage,
      });
    }
  };

  componentDidMount() {
    this.addMouseEvents();
  }

  componentWillUnmount() {
    this.removeMouseEvents();
  }

  render() {
    return (
      <>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            <UrlImage src={this.state.srcImage} />
            {this.state.rectData &&
              this.state.rectData.map((data, key) => (
                <Rect
                  key={key}
                  x={data.x}
                  y={data.y}
                  width={data.w}
                  height={data.h}
                  fill={this.state.color}
                  shadowBlur={10}
                />
              ))}
            {this.state.drag && (
              <Rect
                x={this.state.startX}
                y={this.state.startY}
                width={this.state.endX}
                height={this.state.endY}
                fill={this.state.color}
                shadowBlur={10}
              />
            )}
          </Layer>
        </Stage>
        <div className='fixed-button'>
          <div className='bottom-button'>
            <button
              onClick={() => this.setState({ rectData: [], srcImage: '' })}
            >
              Clear
            </button>
            <button onClick={() => this.onUndo()}>Undo Rectangle</button>
            <button onClick={() => this.onLoadImage()}>Load Image</button>
            <button onClick={() => this.onRestore()}>Restore Previous</button>
            <button
              onClick={() => {
                localStorage.setItem(
                  'rectData',
                  JSON.stringify(this.state.rectData)
                );
                localStorage.setItem('srcImage', this.state.srcImage);
                alert('Saved');
              }}
            >
              Save
            </button>
          </div>
        </div>
      </>
    );
  }
}

export default MyRect;
