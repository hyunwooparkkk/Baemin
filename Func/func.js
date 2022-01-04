exports.show = function (data) {
  if (data == true) {
    let x = "성공!";
    return x;
  }
};

exports.strtoint = function (place) {
  let temp1 = place.replace(/ /gi, "");
  let temp2 = temp1.replace("(", "");
  let temp3 = temp2.replace(")", "");
  let arr = temp3.split(",");
  let x = parseFloat(arr[0]);
  let y = parseFloat(arr[1]);
  let replace = [x, y];
  return replace;
};

exports.distance=function(userPlace,restaurantPlace){
  if(userPlace[0]==restaurantPlace[0] ){

  }
}