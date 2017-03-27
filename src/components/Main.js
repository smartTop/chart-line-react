require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let multiData = require('../data/datas.json');
class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={
      'lineColor': 'red',
      'dotColor': '#333',
      'isBg': true,
      'isMultiData': true,
      'padding': 60
    }
  }
  getPixel(data,key,width,padding){
    var count = data.values[key]['value'+key].length;
    return (width-20-padding)/(count+(count-1)*1.5);
  }
  getMax(data,key,isMultiData){
    if(!isMultiData){
      var maxY = data.values[key]['value'+key][0].y;
      var length = data.values[key]['value'+key].length;
      var keystr = 'value'+key;
      for(var i=1;i<length;i++){
        if(maxY<data.values[key][keystr][i].y){
          maxY = data.values[key][keystr][i].y;
        }
      }
      return maxY;
    }else{
      var maxarr=[];
      var count = data.values.length;
      for(var i=0;i<count;i++){
        maxarr.push(this.getMax(data,i,false));
      }
      var maxvalue = maxarr[0];
      for(var i=1;i<maxarr.length;i++){
        maxvalue = (maxvalue<maxarr[i]) ? maxarr[i]:maxvalue;
      }
      return maxvalue;
    }
  }
  getYPixel(maxY,height,padding){
    var ycount = (parseInt(maxY/10)+1)*10+10;
    return {pixel:(height-padding)/ycount,count:ycount};
  }
  getCoordX(padding,perwidth,ptindex){
    return 2.5*perwidth*ptindex+padding+10-2*perwidth;
  }
  getCoordY(padding,yPixel,value,height){
    var y = yPixel*value;
    return height-padding-y;
  }
  drawXY(ctx,can,data,key,padding,isMultiData,isBg){
    ctx.lineWidth='1';
    ctx.strokeStyle='black';
    ctx.font = 'italic 15px sans-serif';
    ctx.beginPath();
    ctx.moveTo(padding,0);
    ctx.lineTo(padding,can.height-padding);
    ctx.lineTo(can.width,can.height-padding);
    ctx.stroke();
    var perwidth = this.getPixel(data,0,can.width,padding);
    var maxY = this.getMax(data,0,isMultiData);
    var yPixel = this.getYPixel(maxY,can.height,padding).pixel;
    var ycount = this.getYPixel(maxY,can.height,padding).count;
    for(var i=0,ptindex;i<data.values[key]['value'+key].length;i++){
      ptindex  = i+1;
      var x_x = this.getCoordX(padding,perwidth,ptindex);
      var x_y = can.height-padding+20;
      ctx.fillText(data.values[key]['value'+key][i].x,x_x,x_y,perwidth);
    }
    ctx.textAlign='right';
    ctx.textBaseline='middle';
    for(var i=0;i<ycount/10;i++){
      ctx.fillText(i*10,padding-10,(ycount/10-i)*10*yPixel,perwidth);
    }
    if(isBg){
      var x = padding;
      ctx.lineWidth="1";
      ctx.strokeStyle="#e8e8e8";
      for( var i=0;i<ycount/10;i++ ){
        var y = (ycount/10-i)*10*yPixel;
        ctx.moveTo(x,y);
        ctx.lineTo(can.width,y);
        ctx.stroke();
      }
    }//选择绘制背景线
    ctx.closePath();
    this.drawData(can,ctx,data,key,padding,perwidth,yPixel,isMultiData);
  }
  drawData(can,ctx,data,key,padding,perwidth,yPixel,isMultiData,lineColor){
    if(!isMultiData){
      var keystr = "value"+key;
      ctx.beginPath();
      ctx.lineWidth="1";
      if(arguments[8]){
        ctx.strokeStyle=lineColor;
      }else{
        ctx.strokeStyle = this.state.lineColor;
      }
      ctx.beginPath();
      ctx.lineWidth="1";
      for( var i=0;i<data.values[key][keystr].length;i++ ){
        var x = this.getCoordX(padding,perwidth,i+1);
        var y = this.getCoordY(padding,yPixel,data.values[key][keystr][i].y,can.height);
        ctx.lineTo(x,y);
      }
      ctx.stroke();
      ctx.closePath();
      /*下面绘制数据线上的点*/
      ctx.beginPath();
      ctx.fillStyle=this.state.dotColor;
      for( var i=0;i<data.values[key][keystr].length;i++ ){
        var x = this.getCoordX(padding,perwidth,i+1);
        var y = this.getCoordY(padding,yPixel,data.values[key][keystr][i].y);
        ctx.moveTo(x,y);
        ctx.arc(x,y,3,0,Math.PI*2,true);//绘制数据线上的点
        ctx.fill();
      }
      ctx.closePath();
    }else{
      for(var i=0;i<data.values.length;i++ ){
        var color = "rgb("+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+","+parseInt(Math.random()*256)+")";
        this.drawData(can,ctx,data,i,padding,perwidth,yPixel,false,color);
//                     this.drawKey(color,this.keynames[i],padding,i);
      }
    }
  }
  updateCanvas(){
    var can = this.refs.canvas;
    var ctx = can.getContext('2d');
    var data = multiData;
    var padding = this.state.padding;
    var isMultiData = this.state.isMultiData;
    var isBg = this.state.isBg;
    this.drawXY(ctx,can,data,0,padding,isMultiData,isBg);

  }
  componentWillMount(){

  }
  componentDidMount(){
    this.updateCanvas();
  }
  componentDidUpdate(){
    this.updateCanvas();
  }
  render(){
    return <canvas ref="canvas" width="700" height="400" style={{'backgroundColor':'white','position':'absolute','top':'50%','left':'50%','marginLeft':'-350px','marginTop':'-250px'}}></canvas>

  }

}

AppComponent.defaultProps = {
};

export default AppComponent;
